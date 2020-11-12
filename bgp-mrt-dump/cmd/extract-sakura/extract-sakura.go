package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"net"
	"os"
	"strconv"
	"strings"
)

var _ json.Marshaler = &IpEntry{}

type IpEntry struct {
	Prefix *net.IPNet
	As     uint32
	Type   string
}

func (i *IpEntry) MarshalJSON() ([]byte, error) {
	return json.Marshal(&struct {
		As     uint32 `json:"as"`
		Prefix string `json:"prefix"`
		Type   string `json:"type"`
	}{
		As:     i.As,
		Type:   i.Type,
		Prefix: i.Prefix.String(),
	})
}

func main() {
	file, err := os.Open(os.Args[1])
	if err != nil {
		panic(err)
	}

	entries := make([]*IpEntry, 0, 1000000)
	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		entry := &IpEntry{}
		row := scanner.Text()
		for _, filed := range strings.Split(row, "\t") {
			values := strings.Split(filed, "=")
			if len(values) != 2 {
				panic("error")
			}
			switch values[0] {
			case "prefix":
				_, cidr, err := net.ParseCIDR(values[1])
				if err != nil {
					panic(err)
				}
				entry.Prefix = cidr
			case "as":
				as, err := strconv.Atoi(values[1])
				if err != nil {
					panic(err)
				}
				entry.As = uint32(as)
			}
		}
		entries = append(entries, entry)
	}

	targetAs := []uint32{7684, 9370, 9371}
	owned := make([]*IpEntry, 0, 1000)
	related := make([]*IpEntry, 0, 1000)

	for _, entry := range entries {
		for _, as := range targetAs {
			if entry.As == as {
				entry.Type = "sakura"
				owned = append(owned, entry)
				break
			} else {
				entry.Type = "related"
			}
		}
	}
	for _, entry := range entries {
		for _, own := range owned {
			isOwned := false
			for _, as := range targetAs {
				if entry.As == as {
					isOwned = true
				}
			}
			if !isOwned && own.Prefix.Contains(entry.Prefix.IP) {
				related = append(related, entry)
			}
		}
	}

	// for _, entry := range owned {
	// 	fmt.Printf("type=sakura\tprefix=%s\tas=%d\n", entry.Prefix, entry.As)
	// }
	// for _, entry := range related {
	// 	fmt.Printf("type=related\tprefix=%s\tas=%d\n", entry.Prefix, entry.As)
	// }

	all := make([]*IpEntry, 0, len(owned)+len(related))
	all = append(all, owned...)
	all = append(all, related...)

	jsonBy, _ := json.MarshalIndent(all, "", "  ")
	fmt.Print(string(jsonBy))
}
