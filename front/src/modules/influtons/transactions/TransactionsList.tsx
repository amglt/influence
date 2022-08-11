import { Breadcrumb } from '@Components/Breadcrumb';
import { Content } from '@Components/Content';
import { Listing } from '@Components/Listing';
import { Transaction } from '@Models/influtons.models';
import { useTransactions } from '@Api/influtons/influtons.queries';
import React from 'react';
import { format } from '@Utils';

export function TransactionsList() {
  const { data: transactions, isLoading: isLoadingTransactions } =
    useTransactions();

  return (
    <>
      <Breadcrumb
        items={[
          { key: 'influtons', label: 'Influtons' },
          { key: 'wallets', label: 'Historique' },
        ]}
      />
      <Content>
        <Listing<Transaction>
          columns={[
            {
              key: 'id',
              dataIndex: 'id',
              title: 'ID',
              filtered: true,
              sorter: (a, b) => a.id - b.id,
            },
            {
              key: 'createdAt',
              dataIndex: 'createdAt',
              title: 'Date',
              render: (value) => format(new Date(value)),
            },
            {
              key: 'walletFrom',
              dataIndex: 'walletFrom',
              title: 'De',
              render: (_, record) =>
                record.walletFrom
                  ? record.walletFrom.user.nickname
                  : 'Banque de guilde',
            },
            {
              key: 'walletTo',
              dataIndex: 'walletTo',
              title: 'Vers',
              render: (_, record) =>
                record.walletTo
                  ? record.walletTo.user.nickname
                  : 'Banque de guilde',
            },
            {
              key: 'amount',
              dataIndex: 'amount',
              title: 'Montant',
            },
            {
              key: 'requester',
              dataIndex: 'requester',
              title: 'Créé par',
              render: (_, record) => record.requester?.nickname ?? 'Bot',
            },
          ]}
          data={transactions}
          loading={isLoadingTransactions}
        />
      </Content>
    </>
  );
}
