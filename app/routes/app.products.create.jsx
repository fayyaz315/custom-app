import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const price = formData.get("price");

  try {
    // Create product
    const createProductResponse = await admin.graphql(
      `#graphql
        mutation createProduct($input: ProductInput!) {
          productCreate(input: $input) {
            product {
              id
              title
            }
          }
        }`,
      {
        variables: {
          input: {
            title,
            // Add other necessary fields for the product
          },
        },
      }
    );

    if (createProductResponse.errors) {
      console.error("Create product errors:", createProductResponse.errors);
      return json({ errors: createProductResponse.errors }, { status: 400 });
    }

    const productId = createProductResponse.data.productCreate.product.id;

    // Create variant
    const createVariantResponse = await admin.graphql(
      `#graphql
        mutation createVariant($input: ProductVariantInput!) {
          productVariantCreate(input: $input) {
            productVariant {
              id
              price
            }
          }
        }`,
      {
        variables: {
          input: {
            productId,
            price,
            // Add other necessary fields for the variant
          },
        },
      }
    );

    if (createVariantResponse.errors) {
      console.error("Create variant errors:", createVariantResponse.errors);
      return json({ errors: createVariantResponse.errors }, { status: 400 });
    }

    return json({ success: "Product created successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return json({ errors: ["Unexpected error occurred"] }, { status: 500 });
  }
};
