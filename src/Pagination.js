import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ page, pageCount, perPage, switchPage }) => {
  page += 1;
  if (pageCount === 1) return <div />;
  const paginationPages = [];
  if (pageCount > 5 && page > Math.ceil(pageCount / 2)) {
    paginationPages.push(<Pagination.Ellipsis />);
  }
  if (page > 1) {
    for (let i = page - 1; i < page; ++i) {
      paginationPages.push(
        <Pagination.Item
          key={i}
          onClick={() => {
            switchPage(i);
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
  }
  paginationPages.push(
    <Pagination.Item
      key={page}
      active
      onClick={() => {
        switchPage(page);
      }}
    >
      {' '}
      {page}{' '}
    </Pagination.Item>
  );
  if (page + 2 <= pageCount) {
    paginationPages.push(
      <Pagination.Item
        key={page + 1}
        onClick={() => {
          switchPage(page + 1);
        }}
      >
        {page + 1}
      </Pagination.Item>
    );
    paginationPages.push(
      <Pagination.Item
        key={page + 2}
        onClick={() => {
          switchPage(page + 2);
        }}
      >
        {page + 2}
      </Pagination.Item>
    );
  }
  if (
    pageCount > 5 &&
    page < Math.ceil(pageCount / 2) &&
    page + 2 <= pageCount
  ) {
    paginationPages.push(
      <Pagination.Ellipsis key="last-order-pagination-ellipsis" />
    );
  }
  return (
    <Pagination className="pagination">
      <Pagination.First
        key={1}
        onClick={() => {
          switchPage(1);
        }}
      />
      <Pagination.Prev
        onClick={() => {
          switchPage(page - 1 > 1 ? page - 1 : 1);
        }}
      />
      {paginationPages}
      <Pagination.Next
        onClick={() => {
          switchPage(page + 1 > pageCount ? pageCount : page + 1);
        }}
      />
      <Pagination.Last
        key={pageCount}
        onClick={() => {
          switchPage(pageCount);
        }}
      />
    </Pagination>
  );
};

export default PaginationComponent;
