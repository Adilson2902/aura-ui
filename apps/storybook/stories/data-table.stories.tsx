import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type DataTableColumn } from "@aura/ui/data-table";

type Row = { id: string; name: string; status: string; total: number };
const data: Row[] = Array.from({ length: 13 }, (_, index) => ({
  id: String(index + 1),
  name: `Cliente ${index + 1}`,
  status: index % 3 === 0 ? "Pendente" : "Ativo",
  total: (index + 1) * 99
}));
const columns: DataTableColumn<Row>[] = [
  { id: "name", header: "Cliente", accessor: (row) => row.name },
  { id: "status", header: "Status", accessor: (row) => row.status },
  { id: "total", header: "Valor", accessor: (row) => row.total }
];
const meta = { title: "UI/Data Table", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: () => (
    <DataTable
      data={data}
      columns={columns}
      getRowId={(row) => row.id}
      caption="Clientes de demonstração"
    />
  )
};
export const Empty: Story = {
  render: () => (
    <DataTable data={[]} columns={columns} getRowId={(row) => row.id} caption="Tabela vazia" />
  )
};
export const SingleRow: Story = {
  render: () => <DataTable data={data.slice(0, 1)} columns={columns} getRowId={(row) => row.id} />
};
