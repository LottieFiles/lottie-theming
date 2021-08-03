
import React, { useCallback, useState } from "react";
import './App.css';
import { Player } from '@lottiefiles/react-lottie-player';
//import { Button, Card, Gridlist } from '@lottiefiles/react-ui-kit';
import { Card, Icon, Image, Grid, Header, Button, Segment } from 'semantic-ui-react'
//import { DndProvider } from "react-dnd";
//import HTML5Backend from "react-dnd-html5-backend";
import Dropzone from "./Dropzone";

function App() {

  const [lottieData, setLottieData] = useState([]);
  //"https://assets3.lottiefiles.com/packages/lf20_UJNc2t.json"

  const onDrop = useCallback(acceptedFiles => {
    // this callback will be called after files get dropped, we will get the acceptedFiles. If you want, you can even access the rejected files too
    console.log(acceptedFiles);

    var reader = new FileReader();
    reader.onload = function (e) {
      var contents = e.target.result;
      setLottieData(contents);
    };
    reader.readAsText(acceptedFiles[0]);    
  }, []);

  return (

    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            
            <Editor lottieSrc={lottieData}/>

          </Grid.Column>
          <Grid.Column floated='right' width={8}>
            {/* <Editor /> */}
            <Dropzone onDrop={onDrop} accept={"application/json"} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
            <Button size='huge'>Check Them Out</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

  );
}

function Editor({ lottieSrc }) {  
  return (lottieSrc.length > 0 ?
    <Player
      autoplay={true}
      loop
      src={lottieSrc}
      style={{ height: '600px', width: '600px' }}
    >
    </Player> : <div style={{ height: '600px', width: '600px' }}></div>
  );
}

// const CardExampleCard = () => (
//   <Card>
//     <Image src='/images/avatar/large/matthew.png' wrapped ui={false} />
//     <Card.Content>
//       <Card.Header>Matthew</Card.Header>
//       <Card.Meta>
//         <span className='date'>Joined in 2015</span>
//       </Card.Meta>
//       <Card.Description>
//         Matthew is a musician living in Nashville.
//       </Card.Description>
//     </Card.Content>
//     <Card.Content extra>
//       <a>
//         <Icon name='user' />
//         22 Friends
//       </a>
//     </Card.Content>
//   </Card>
// )


export default App;
