import {
  Card,
  Page,
  Text,
  Button,
  ResourceItem,
  InlineStack,
  Badge,
  ResourceList,
} from "@shopify/polaris";
import { Link } from "@remix-run/react";


export default function Announcements() {
  const announcements = [
    {
      _id: "64dca1f1a67e0e0b38f9b821",
      name: "Summer Sale",
      type: "Promotion",
      status: "Published",
      shop: "my-shop.myshopify.com"
    },
    {
      _id: "64dca1f1a67e0e0b38f9b822",
      name: "New Product Launch",
      type: "Product Update",
      status: "Not published",
      shop: "my-shop.myshopify.com"
    },
    {
      _id: "64dca1f1a67e0e0b38f9b823",
      name: "Holiday Shipping Deadlines",
      type: "Information",
      status: "Published",
      shop: "my-shop.myshopify.com"
    },
    {
      _id: "64dca1f1a67e0e0b38f9b824",
      name: "End of Season Clearance",
      type: "Promotion",
      status: "Not published",
      shop: "my-shop.myshopify.com"
    },
    {
      _id: "64dca1f1a67e0e0b38f9b825",
      name: "Maintenance Downtime",
      type: "System Update",
      status: "Published",
      shop: "my-shop.myshopify.com"
    }
  ];

const resourceName = {
  singulr: 'announcment',
  plural: 'announcments'
}

const renderItem = (item) =>{
 const {_id, name, type, status} = item
 return (
      <ResourceItem
      id={_id.toString()}
      accessibilityLabel={`View details for ${name}`}
      style={{padding: '0'}}

      >
        <Link to={`/app/annoucements/${_id.toString()}`} style={{ textDecoration: 'none', color: 'inherit'}}>
        <InlineStack align="center" fill>
          <div style={{flex: 1}}>
            <Text variant="bodyMd" fontWeight="bold" as="h3">
              {name}
            </Text>
          </div>
          <div style={{flex: 0.5, display: 'flex', justifyContent: 'center'}}>
            <Text variant="bodyMd" as="p">
              {type}
            </Text>
          </div>
          <div style={{flex: 0.5, display: 'flex', justifyContent: 'flex-end'}}>
            <Badge tone={status === "Published" ? "success" : ""}>
              {status === "Published" ? "Published" : "Not published"}
            </Badge>
          </div>
        </InlineStack>
        
        </Link>

      </ResourceItem>
 )
}


  return (
    <Page
      title="Annnoucements"
      primaryAction={
        <Link to="/app/new">
        <Button variant="primary" size="large"> New Announcment</Button>
        </Link>
      }
    >

      { !announcements.length ? (
        <Card sectioned>
              <div className="card-wrpper" style={{ padding: '100px 0', textAlign: 'center'}}>
                <img src="https://essential-announcement-bar-5bd085b4d90e.herokuapp.com/assets/announcements-main-image-e8b3def0.svg"
                alt="Announcment Bar"
                style={{margin: '0 auto'}}
                />
                <Text variant="headingLg" as="h5">
                  This is where you'll manage your announcements
                </Text>
                <div style={{padding: '20px 0'}}>
                <p style={{ margin: '10px 0 20px'}}>
                  Start by creating your first announcment and publishing it to your store
                </p>
                <Link to="/app/new">
                  <Button variant="primary" size="large"> New Announcment</Button>
                  </Link>
                </div>
              </div>
              </Card>

      ):

      (
        <Card padding="0">
                <ResourceList
                  resourceName={resourceName}
                  items={announcements}
                  renderItem={renderItem}
                >

                </ResourceList>
              </Card>
      )
    
    } 
      

      


    </Page>
  );
}

