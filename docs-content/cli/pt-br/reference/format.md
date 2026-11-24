<p align="center"><a href="../../README.md">English</a> | <a href="../../README.pt-br.md">Português (Brasil)</a></p>


# O FORMAT — a spec normativa

O contrato completo do kit é o [FORMAT.md](../../FORMAT.md) (v1) — a
fonte única da verdade: toda regra que os checks enforçam, o grammar das
entidades, os dois níveis de enforcement (hard/soft) e as estruturas
canônicas. **Esta página não duplica** — ela aponta.

| O que você procura | Onde está no FORMAT |
| --- | --- |
| O layout do workspace, o wizard do init, os modelos de versionamento | §2 (com §2.1 camadas, §2.2 stack-templates, §2.3 container) |
| `golmet.yaml` — o manifesto | §3 (com §3.1 o contrato de pack) |
| Gramática de IDs e de evidência | §4 · §5 |
| Estados: diretivas e front matter | §6 (com §6.1 o subset YAML) |
| Entidades e a máquina de estados (Charter, RN, PEND, CR, Feature, Task, Spec, ADR, Candidate) | §7 (com §7.7.1 agregados de specs) |
| O Índice de Estados (`golmet.index.json`) | §8 |
| Enforcement — hard (`validate` H1–H10), soft (`doctor` S1–S5), o lint L1–L10, o contexto de execução, o padrão de cancelamento | §9 (com §9.1 lint) |
| O contrato de skill (front matter de capacidades) | §10 (com §10.1 o duplo registro) |
| Erros estruturados (`--json`) | §11 |
| Versionamento do FORMAT e a guarda de escopo | §12 · §13 |
