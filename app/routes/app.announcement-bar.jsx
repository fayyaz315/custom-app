import {
  Page,
  Button,
  Card, 
  Text,
  Box
} from '@shopify/polaris';


export default function announcementBar() {
  return (
    <Page
      title="Announcements"
      primaryAction={<Button variant="primary" size='large'>New announcement</Button>}
    >
      
      <Card title="Credit card" sectioned>
      <div className='card-wrapper' style={{padding: '100px auto', textAlign: 'center'}}>

        <img src='https://essential-announcement-bar-5bd085b4d90e.herokuapp.com/assets/announcements-main-image-e8b3def0.svg'  alt='annuncment Bar'/>
        <Text variant="headingLg" as="h5">
          This is where you’ll manage your announcements
        </Text>
        <Box paddingBlock={'100'} >
        <p>Credit card information</p>
        </Box>
        
        </div>  
      </Card>
      
    </Page>
  );
}


