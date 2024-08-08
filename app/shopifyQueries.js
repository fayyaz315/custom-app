export const fetchStoreStatistics = async (admin) => {
  // Fetch total sales
  const salesResponse = await admin.graphql(
    `#graphql
      {
        orders(first: 250, query: "financial_status:paid") {
          edges {
            node {
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
            }
          }
        }
      }`
  );
  const salesData = await salesResponse.json();
  const totalSales = salesData.data.orders.edges.reduce(
    (acc, order) => acc + parseFloat(order.node.totalPriceSet.shopMoney.amount),
    0
  );

  // Fetch total orders
  const ordersResponse = await admin.graphql(
    `#graphql
      {
        orders(first: 250) {
          edges {
            node {
              id
            }
          }
        }
      }`
  );
  const ordersData = await ordersResponse.json();
  const totalOrders = ordersData.data.orders.edges.length;

  // Fetch total products
  const productsResponse = await admin.graphql(
    `#graphql
      {
        products(first: 250) {
          edges {
            node {
              id
            }
          }
        }
      }`
  );
  const productsData = await productsResponse.json();
  const totalProducts = productsData.data.products.edges.length;

  // Fetch top-selling products
  const topProductsResponse = await admin.graphql(
    `#graphql
      {
        orders(first: 250, sortKey:TOTAL_PRICE, reverse: true) {
          edges {
            node {
              lineItems(first: 5) {
                edges {
                  node {
                    title
                    quantity
                  }
                }
              }
            }
          }
        }
      }`
  );
  const topProductsData = await topProductsResponse.json();
  const productSalesMap = {};
  topProductsData.data.orders.edges.forEach((order) => {
    order.node.lineItems.edges.forEach((item) => {
      if (productSalesMap[item.node.title]) {
        productSalesMap[item.node.title] += item.node.quantity;
      } else {
        productSalesMap[item.node.title] = item.node.quantity;
      }
    });
  });
  const topProducts = Object.keys(productSalesMap)
    .map((title) => ({ title, sales: productSalesMap[title] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return { totalSales, totalOrders, totalProducts, topProducts };
};

export const fetchProducts = async (admin) => {
  const response = await admin.graphql(
    `#graphql
      {
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              status
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price
                    barcode
                    createdAt
                  }
                }
              }
            }
          }
        }
      }`
  );
  const responseJson = await response.json();
  return responseJson.data;
};
