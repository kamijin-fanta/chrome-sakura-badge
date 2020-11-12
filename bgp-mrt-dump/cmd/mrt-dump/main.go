package main

import (
	"fmt"
	"github.com/osrg/gobgp/pkg/packet/bgp"
	"github.com/osrg/gobgp/pkg/packet/mrt"
	"io"
	"log"
	"os"
)

type IpEntry struct {
	Prefix *bgp.IPAddrPrefix
	As     uint32
}

func main() {
	file, err := os.Open(os.Args[1])
	if err != nil {
		panic(err)
	}

	for {
		buf := make([]byte, mrt.MRT_COMMON_HEADER_LEN)
		_, err := file.Read(buf)
		if err == io.EOF {
			break
		} else if err != nil {
			log.Fatalf("failed to read: %s", err)
		}

		h := &mrt.MRTHeader{}
		err = h.DecodeFromBytes(buf)
		if err != nil {
			log.Fatalf("failed to parse")
		}

		buf = make([]byte, h.Len)
		_, err = file.Read(buf)
		if err != nil {
			log.Fatalf("failed to read")
		}

		msg, err := mrt.ParseMRTBody(h, buf)
		if err != nil {
			log.Printf("failed to parse: %s", err)
			continue
		}

		if msg.Header.Type == mrt.TABLE_DUMPv2 {
			subType := mrt.MRTSubTypeTableDumpv2(msg.Header.SubType)
			switch subType {
			case mrt.PEER_INDEX_TABLE:
				continue
			case mrt.GEO_PEER_TABLE:
				continue
			case mrt.RIB_IPV4_UNICAST, mrt.RIB_IPV4_UNICAST_ADDPATH:
			case mrt.RIB_IPV6_UNICAST, mrt.RIB_IPV6_UNICAST_ADDPATH:
				continue
			default:
				log.Fatalf("unsupported subType: %v", subType)
			}

			rib := msg.Body.(*mrt.Rib)

			prefix := rib.Prefix.(*bgp.IPAddrPrefix)

			res := &IpEntry{
				Prefix: prefix,
			}
			if len(rib.Entries) == 0 {
				continue
			}
			for _, attr := range rib.Entries[0].PathAttributes {
				asPath, ok := attr.(*bgp.PathAttributeAsPath)
				if !ok {
					continue
				}
				ass := asPath.Value[0].GetAS()
				res.As = ass[len(ass)-1]
			}

			fmt.Printf("prefix=%s\tas=%d\n", res.Prefix, res.As)
		}
	}

}
