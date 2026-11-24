# Development

The CLI is written in **Go 1.22+** (module `github.com/Golmet/golmet-cli`),
with [spf13/cobra](https://github.com/spf13/cobra) as the only external
dependency. **639 Go tests** (unit + integration + binary e2e) back the
current state.

```bash
go build ./...                    # build
go build -o golmet ./cmd/golmet   # local binary
go test ./...                     # tests
go vet ./... && gofmt -l .        # mandatory before committing
```
