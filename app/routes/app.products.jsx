import { useState, useCallback, useEffect } from "react";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  DataTable,
  Thumbnail,
  Modal,
  FormLayout,
  TextField,
  Frame,
  Toast,
} from "@shopify/polaris";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
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
  return json(responseJson.data);
};

export default function Products() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const products = data.products.edges;

  const [active, setActive] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [variantId, setVariantId] = useState('');
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleModalChange = useCallback(() => setActive(!active), [active]);
  const toggleToastActive = useCallback(() => setToastActive((active) => !active), []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setPrice(product.variants.edges[0]?.node.price || '');
    setVariantId(product.variants.edges[0]?.node.id);
    setIsCreating(false);
    setActive(true);
  };

  const handleCreate = () => {
    setTitle('');
    setPrice('');
    setVariantId('');
    setEditingProduct(null);
    setIsCreating(true);
    setActive(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);

    if (isCreating) {
      await fetcher.submit(formData, { method: "POST", action: "/app/products/create" });
    } else {
      formData.append('id', editingProduct.id);
      formData.append('variantId', variantId);
      await fetcher.submit(formData, { method: "POST", action: "/app/products/edit" });
    }
  };

  const handleDelete = async (productId) => {
    setIsDeleting(true);
    await fetcher.submit({ id: productId }, { method: "POST", action: "/app/products/delete" });
  };

  useEffect(() => {
    if (fetcher.state === "idle") {
      if (fetcher.data?.success) {
        setToastContent(fetcher.data.success);
        setToastActive(true);
        setActive(false);
      } else if (fetcher.data?.errors) {
        console.error(fetcher.data.errors);
      }
      setIsSaving(false);
      setIsDeleting(false);
      fetcher.load("/app/products");
    }
  }, [fetcher.state, fetcher.data]);

  const rows = products.map(({ node: product }) => [
    <Thumbnail
      source={product.images.edges[0]?.node.originalSrc || ""}
      alt={product.images.edges[0]?.node.altText || "Product Image"}
    />,
    product.title,
    product.status,
    product.variants.edges[0]?.node.price || "",
    <Button onClick={() => handleEdit(product)}>Edit</Button>,
    <Button destructive onClick={() => handleDelete(product.id)} loading={isDeleting}>Delete</Button>
  ]);

  return (
    <Frame>
      <Page
        fullWidth
        primaryAction={{
          content: 'Add Product',
          onAction: handleCreate,
        }}
      >
        <Layout>
          <Layout.Section>
            <Card>
              <Text as="h2" variant="headingMd">
                Products List
              </Text>
              <DataTable
                columnContentTypes={["text", "text", "text", "text", "text", "text"]}
                headings={["Image", "Title", "Status", "Price", "Edit", "Delete"]}
                rows={rows}
              />
            </Card>
          </Layout.Section>
        </Layout>

        <Modal
          open={active}
          onClose={handleModalChange}
          title={isCreating ? "Add Product" : "Edit Product"}
          primaryAction={{
            content: 'Save',
            onAction: handleSave,
            loading: isSaving,
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: handleModalChange,
            },
          ]}
        >
          <Modal.Section>
            <FormLayout>
              <TextField
                label="Title"
                value={title}
                onChange={(value) => setTitle(value)}
              />
              <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(value) => setPrice(value)}
              />
            </FormLayout>
          </Modal.Section>
        </Modal>

        {toastActive && (
          <Toast content={toastContent} onDismiss={toggleToastActive} />
        )}
      </Page>
    </Frame>
  );
}
