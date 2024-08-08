import {
  Page,
  Layout,
  Banner,
  LegacyCard,
  FormLayout,
  TextField,
  Badge
} from '@shopify/polaris';

export default function PageExample(){
  return(
    <Page
    title="3/4 inch Leather pet collar"
    titleMetadata={<Badge tone="success">Paid</Badge>}
    subtitle="Perfect for any pet"
    compactTitle
    primaryAction={{content: 'Save', disabled: true}}
    secondaryActions={
      [
        {
          content: 'Duplicate',
          accessibilityLabel: 'Secondary action label',
          onAction: ()=> alert('Duplicate action')
        },
        {
          content: 'View on your store',
          onAction: () => alert('View on Store action')
        }
      ]
    }
    actionGroups={[
      {
        title: 'Promote',
        actions: [
          {
            content: 'Share on Facebook',
            accessibilityLabel: 'Individual action lable',
            onAction: () => alert('Share on facebook action')
          }
        ]
      }
    ]}
    pagination={
      {
        hasPrevious: true,
        hasNext: true
      }
    }
    >

<Layout>
        <Layout.Section>
          <Banner title="Order archived" onDismiss={() => {}}>
            <p>This order was archived on March 7, 2017 at 3:12pm EDT.</p>
          </Banner>
        </Layout.Section>
        <Layout.AnnotatedSection
          id="storeDetails"
          title="Store details"
          description="Shopify and your customers will use this information to contact you."
        >
          <LegacyCard sectioned>
            <FormLayout>
              <TextField
                label="Store name"
                onChange={() => {}}
                autoComplete="off"
              />
              <TextField
                type="email"
                label="Account email"
                onChange={() => {}}
                autoComplete="email"
              />
            </FormLayout>
          </LegacyCard>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  )
}