import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardPrimaryAction,
  CardMedia,
  CardActions,
  CardActionButtons,
  CardActionButton,
} from '@rmwc/card';
import { Typography } from '@rmwc/typography';
import '@rmwc/card/styles';
import '@rmwc/typography/styles';
import gamesImg from '../images/games.jpg';
import homeworkImg from '../images/homework.jpg';
import projectsImg from '../images/projects.jpg';
import otherImg from '../images/other.jpg';


function EventCard({ event_id }) {
  const [event, setEvent] = useState({});

  useEffect(() => {
    fetchEvent();
  }, []);


  async function fetchEvent() {
    const response = await fetch(`/events/${event_id}`);
    const json = await response.json();
    //console.log('event', json);
    setEvent(json);
  }

  //TODO add MISC category
  const imageMap = {
    'VIDEOGAMES': `url(${gamesImg})`,
    'PROJECTS': `url(${projectsImg})`,
    'HOMEWORK': `url(${homeworkImg})`,
    'OTHER': `url(${otherImg})`,
  }

  return (
    <div>
      <Card style={{ width: '21rem', margin: '15px'}}>
        <CardPrimaryAction>
          <CardMedia
            sixteenByNine
            style={{
              backgroundImage: imageMap[`${event.type}`]
            }}
          />
          <div style={{ padding: '0 1rem 1rem 1rem' }}>
            <Typography use="headline6" tag="h2">
              {event.title}
            </Typography>
            <Typography
              use="subtitle2"
              tag="h3"
              theme="textSecondaryOnBackground"
              style={{ marginTop: '-1rem' }}
            >
            </Typography>
            <Typography
              use="body1"
              tag="div"
              theme="textSecondaryOnBackground"
            >
              {event.description}
            </Typography>
          </div>
        </CardPrimaryAction>
        <CardActions>
          <CardActionButtons>
          <Link 
            to={`/checkEvent/${event.event_id}`}
          >
            <CardActionButton>
              View More
            </CardActionButton>
          </Link>
          </CardActionButtons>
        </CardActions>
      </Card>
    </div>
  );
}


export default EventCard;