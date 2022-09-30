import { useRef } from 'react';
import { Table, Input, Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/lib/table/interface';
import type { ColumnsType, ColumnType } from 'antd/lib/table';
import type { InputRef } from 'antd';
import { v4 as uuid } from 'uuid';

interface ListingProps<DataType> {
  columns: ColumnsType<DataType>;
  data?: DataType[];
  loading?: boolean;
}

export function Listing<DataType extends object = {}>(
  props: ListingProps<DataType>,
) {
  const { columns, data, ...tableProps } = props;

  type DataIndex = keyof DataType;

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    confirm();
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
  ): ColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${String(dataIndex)}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const getCols = () => {
    return columns.map((col) => {
      const colToReturn = col;
      if (colToReturn.filtered) {
        Object.assign(
          colToReturn,
          getColumnSearchProps(colToReturn.key as DataIndex),
        );
      }
      return colToReturn;
    });
  };

  return (
    <Table
      columns={getCols()}
      dataSource={data?.map((d) => ({ key: uuid(), ...d }))}
      pagination={{
        defaultPageSize: 20,
      }}
      {...tableProps}
    />
  );
}
