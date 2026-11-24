# Development

O CLI é escrito em **Go 1.22+** (módulo `github.com/Golmet/golmet-cli`), com
[spf13/cobra](https://github.com/spf13/cobra) como única dependência
externa. **639 testes Go** (unitários + integração + e2e do binário)
sustentam o estado atual.

```bash
go build ./...            # build
go build -o golmet ./cmd/golmet   # binário local
go test ./...             # testes
go vet ./... && gofmt -l . # obrigatórios antes de commitar
```
