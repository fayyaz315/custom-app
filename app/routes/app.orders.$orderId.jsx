import { useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/node"
import { authenticate } from "../shopify.server"
import {
  Page,
  Layout,
  Card,
  Text,
  DataTable,
  Frame,
} from "@shopify/polaris"

export const loader = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request)
  const orderId = params.orderId
  const response = await admin.graphql(
    `#graphql
      {
        order(id: "gid://shopify/Order/${orderId}") {
          id
          name
          email
          createdAt
          totalPriceSet {
            shopMoney {
              amount
            }
          }
          displayFinancialStatus
          customer {
            firstName
            lastName
            email
          }
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
                originalUnitPriceSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
        }
      }`
  )
  const responseJson = await response.json()
  return json(responseJson.data)
}

export default function OrderDetail() {
  const data = useLoaderData()
  const { order } = data
  const customer = order.customer

  const rows = order.lineItems.edges.map(({ node: item }) => [
    item.title,
    item.quantity,
    item.originalUnitPriceSet.shopMoney.amount,
  ])

  return (
    <Frame>
      <Page title={`Order ${order.name}`}>
        <Layout>
          <Layout.Section>
            <Card title="Order Details">
                <Text variant="headingMd">Order Name: {order.name}</Text>
                <Text>Email: {order.email}</Text>
                <Text>Created At: {new Date(order.createdAt).toLocaleString()}</Text>
                <Text>Total Price: ${order.totalPriceSet.shopMoney.amount}</Text>
                <Text>Status: {order.displayFinancialStatus}</Text>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card title="Customer Details">
                <Text>First Name: {customer.firstName}</Text>
                <Text>Last Name: {customer.lastName}</Text>
                <Text>Email: {customer.email}</Text>
            </Card>
          </Layout.Section>
          <Layout.Section>
            <Card title="Order Items">
              <DataTable
                columnContentTypes={["text", "numeric", "numeric"]}
                headings={["Item", "Quantity", "Price"]}
                rows={rows}
              />
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  )
}