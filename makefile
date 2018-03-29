.PHONY: all

chrome-sakura-badge.zip: $(shell find chrome-sakura-badge)
	zip -r chrome-sakura-badge.zip chrome-sakura-badge

.PHONY: clean

clean:
	rm chrome-sakura-badge.zip

