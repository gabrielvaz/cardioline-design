# Auditoria de UX: densidade clínica no Beat Design System

Documento vivo. Registra rodadas de auditoria que comparam boas práticas de pesquisa em UX para software clínico de alta densidade informacional (dashboards, monitoramento, EHR, ECG, normas de usabilidade para dispositivo médico) com o que está implementado no Beat Design System e no Vireo ARC. Cada rodada é uma entrada datada, adicionada ao topo. Achados priorizados em P0 (gravíssimo) a P3 (baixo), por risco à segurança clínica e à integridade diagnóstica, não apenas por estética.

---

## 2026-07-23

**Escopo:** `packages/ui/src`, `apps/vireo-arc/src`
**Método:** pesquisa de boas práticas (fontes ao final) cruzada com auditoria read-only do código, sem alteração alguma.

### P0, Gravíssimo (risco direto à segurança clínica ou à integridade diagnóstica)

1. **Critérios de priorização da Exam Inbox são 100% desligáveis, sem trava.**
   Princípio violado: Situational Awareness (Endsley) exige que dados de nível 2 (compreensão de gravidade) não possam ser removidos silenciosamente da leitura do profissional; IEC 62366 exige mitigação de risco de uso incorreto em tarefas críticas.
   Evidência: `apps/vireo-arc/src/components/exams/exam-inbox.tsx:264-314` (`PrioritySettings`) permite desligar o critério "Emergency" sem confirmação; um caso emergencial deixa de subir no ranking sem aviso.
   Recomendação: bloquear ou exigir confirmação explícita e reversível para desligar o critério de emergência.

2. **Ordenação por gravidade pode ser trocada sem aviso de perda de hierarquia clínica.**
   Princípio violado: mesmo princípio de SA acima; ausência de sinalização de que a lista não está mais ordenada por urgência quebra a projeção de risco (nível 3).
   Evidência: `exam-inbox.tsx:83`, dropdown de ordenação com opções "Longest waiting / Most recent / Patient name" substituindo "priority" sem indicador persistente.
   Recomendação: manter um selo visual fixo de "fora de ordem por gravidade" enquanto outro critério estiver ativo.

3. **O traçado do ECG renderiza só 6 das 12 derivações.**
   Princípio violado: leitura de 12 derivações é o padrão clínico mínimo para localizar isquemia ou infarto; reduzir 6 derivações a números de tabela, sem traçado visual, compromete o diagnóstico.
   Evidência: `ecg-viewer.tsx:12` define 12 leads, mas o componente `Waveform` na linha 85 só recebe aVF, V1 a V5.
   Recomendação: garantir as 12 derivações visíveis como traçado, mesmo que exija rolagem interna dedicada e sinalizada.

4. **Controle "Compare" no ECG viewer é decorativo, não funcional.**
   Princípio violado: affordance enganosa em ferramenta clínica gera falsa sensação de projeção (SA nível 3): o profissional pode acreditar que comparou exames quando não comparou nada.
   Evidência: `ecg-viewer.tsx:74`, Select com opções "Compare / None / Previous exam" sem nenhuma lógica de renderização conectada.
   Recomendação: remover o controle até a função existir, ou marcá-lo claramente como indisponível.

### P1, Grave (fricção séria de workflow clínico, adjacente à segurança)

1. **Nenhum zoom ou pan no traçado de ECG.**
   Evidência: ausente em `ecg-viewer.tsx`; zoom só existe no `report-pdf-viewer.tsx:14,32`, fora do fluxo de diagnóstico.
   Recomendação: portar o mecanismo de zoom do PDF viewer para o ECG viewer.

2. **Nenhum breadcrumb ou contexto persistente de paciente no produto.**
   Evidência: breadcrumb só existe hardcoded em `patient-detail-view.tsx:25`; ausente no ECG workspace e demais telas de detalhe.
   Recomendação: componentizar um breadcrumb com identificação do paciente e aplicar a todas as telas de exame/detalhe.

3. **"Critical alerts" tem o mesmo peso visual dos demais cards do dashboard.**
   Evidência: `dashboard-overview.tsx:207` usa o mesmo componente Card genérico dos outros 3 indicadores.
   Recomendação: dar destaque estrutural (tamanho, posição ou cor) ao card crítico em vez de tratá-lo como métrica neutra.

4. **Truncamento de texto em densidade compact/comfortable sem fallback visível.**
   Evidência: `exam-inbox.tsx:516-517`, texto quebra em múltiplas linhas só na densidade spacious; nas demais, trunca com `truncate`.
   Recomendação: adicionar tooltip/hover em toda célula truncada, independentemente da densidade escolhida.

5. **Rolagem horizontal obrigatória na tela mais crítica do produto.**
   Evidência: linhas de derivação com largura mínima de 1160px e tabela de medições com 920px, ambas em `overflow-auto` (`ecg-viewer.tsx:39-48,85`).
   Recomendação: redesenhar o layout responsivo para caber sem rolagem horizontal nas resoluções-alvo, ou paginar por grupo de derivações.

### P2, Médio (perda de eficiência e consistência, sem risco direto)

1. **Nenhuma tabela clínica tem cabeçalho fixo (sticky header).**
   Evidência: nenhuma ocorrência de `sticky` em `thead`; o único sticky do sistema é a coluna de ação em mobile (`globals.css:153`).
   Recomendação: tornar o thead sticky em Exam list, Patient list e Reports.

2. **Barra de métricas do Exam Inbox não é fixa ao rolar.**
   Evidência: `exam-inbox.tsx:153-157`, métricas Awaiting/Urgent/Avg. wait embutidas no slot de ações do PageHeader, sem `sticky`.
   Recomendação: fixar a barra de métricas ao topo da lista ao rolar.

3. **Nenhum atalho de teclado em toda a aplicação.**
   Evidência: busca por `keydown/shortcut/hotkey` não retorna resultado em `apps/vireo-arc/src` nem `packages/ui/src`.
   Recomendação: mapear atalhos básicos (busca, navegação de linha, confirmar/rejeitar).

4. **Densidade de tabela é uma preferência global única, não tokenizada.**
   Evidência: `use-global-table-density.ts:13-27` persiste um único valor para todas as tabelas (default "comfortable"); classes duplicadas em `exam-inbox.tsx:474-479` e `tanstack-exam-table.tsx`.
   Recomendação: extrair token de densidade em `packages/ui/src/tokens` e permitir override por tabela.

5. **Nenhuma tipografia numérica dedicada para dados clínicos.**
   Evidência: `font-variant-numeric: tabular-nums` só aparece pontualmente em `report-pdf-viewer.tsx`, não como regra do design system.
   Recomendação: aplicar tabular-nums como token global para toda célula numérica.

### P3, Baixo (maturidade do design system, sem impacto imediato)

1. **Nenhuma paleta de cor clínica além do genérico destructive/warning/success.**
   Evidência: `packages/ui/src/tokens/colors.ts` só define paleta de marca e semantic genérico.
   Recomendação: avaliar tokens de urgência clínica dedicados se o produto crescer em número de fluxos de triagem.

2. **Busca global some por completo na ECG workspace.**
   Evidência: `dashboard-shell.tsx:51`, `{!isExamView && <Header />}` remove o Header inteiro na tela de exame.
   Recomendação: manter uma busca compacta acessível mesmo dentro da workspace.

3. **Documentação do Beat DS não menciona densidade clínica como princípio.**
   Evidência: `.agents/skills/beat-design-system/SKILL.md` não cita densidade ou "acima da rolagem" como diretriz.
   Recomendação: registrar a diretriz de densidade clínica na skill/documentação do DS.

### Fontes da pesquisa

- [Aufait UX, Healthcare Dashboard UI/UX Design Best Practices](https://www.aufaitux.com/blog/healthcare-dashboard-ui-ux-design-best-practices/)
- [Fuselab Creative, Healthcare Dashboard Design Best Practices](https://fuselabcreative.com/healthcare-dashboard-design-best-practices/)
- [Pencil & Paper, Data Table Design UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables)
- [Setproduct, Data Table UI Design Reference Guide](https://www.setproduct.com/blog/data-table-ui-design)
- [Intensive Care Medicine (Springer), Alarm Fatigue and Cognitive Load Theory](https://link.springer.com/article/10.1007/s00134-024-07450-3)
- [JMIR Human Factors, Novel Interface Designs for Patient Monitoring](https://humanfactors.jmir.org/2020/3/e15052/)
- [Greenlight Guru, IEC 62366 Usability Engineering](https://www.greenlight.guru/blog/iec-62366-usability-engineering)
- [Endsley & Jones, Designing for Situation Awareness (3rd ed.)](https://www.researchgate.net/publication/389370407_Designing_for_Situation_Awareness_An_Approach_to_User-Centered_Design_Third_Edition)
- [Nielsen Norman Group, Scrolling and Attention](https://www.nngroup.com/articles/scrolling-and-attention/)
