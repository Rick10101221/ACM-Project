import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { Checkbox } from '@rmwc/checkbox';
import Divider from '@material-ui/core/Divider'
import EventCard from '../components/eventCardComponent';
import { Typography } from '@rmwc/typography';
import { TextField } from '@rmwc/textfield'
import '@rmwc/typography/styles';
import '@rmwc/checkbox/styles';

const OuterDiv = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 15vh;
  border-width: 1px;
  border-style: solid;
  border-color: #333333;
`;

function SearchForm() {
  const [input, setInput] = useState('');


  //Array set to store results from the fetch function
  const [results, setResults] = useState([]);
  //Textbox element used for filtering the events.
  // const [search, setSearch] = useState('')
  //Array set to store the filtered events.
  const [filteredEvents, setFilteredEvents] = useState([]);

  //Boolean values that check whether or not checkboxes are checked 
  const [homework, setHomework] = useState(false)
  const [projects, setProjects] = useState(false);
  const [games, setGames] = useState(false);


  /**
   * Fetches all the events from the database and stores the elements within an array.
   */
  async function handleSubmit() {
    // setInputSubmit(input);
    console.log("FETCHING");
    setResults([]);
    const response = await fetch("http://localhost:5000/events/");
    const res = await response.json();
    setFilteredEvents([]);
    setResults(res);
    if(input != '') {
      handleFilter(res);
    }
    else if(homework == true) {
      homeworkFilter(res);
    }
    else if(games == true) {
      gamesFilter(res);
    }
    else if(projects == true) {
      projectsFilter(res);
    }
    else {
      setFilteredEvents(res);
    }
    if(dateFilter == true) {
      dateFilter(res);
    }
  }

  function handleFilter(unfilteredResults) {
    setFilteredEvents([]);
    console.log("HANDLING FILTER");
    console.log("got data length = " + unfilteredResults.length)
    console.log("FILTER " + input);
    const events = unfilteredResults.filter(event => event.title.toLowerCase().includes(input.toLowerCase()));
    setFilteredEvents(events);
  }
/**
 * Column filtering based on the homework filter
 */
  async function homeworkFilter(unfilteredResults) {
    if(homework == true) {
      setFilteredEvents([])
      console.log("HANDLING FILTER HOMEWORK");
      const filters = unfilteredResults.filter(event => event.type.toLowerCase().includes("homework"));
      setFilteredEvents(filters); 
    }
  }

/**
 * Column filtering based on the games filter
 */
async function gamesFilter(unfilteredResults) {
  if(games == true) {
    setFilteredEvents([])
    console.log("HANDLING FILTER HOMEWORK");
    const filters = unfilteredResults.filter(event => event.type.toLowerCase().includes("games"));
    setFilteredEvents(filters); 
  }
}
/**
 * Column filtering based on the projects filter.
 */
async function projectsFilter(unfilteredResults) {
  if(projects == true) {
    setFilteredEvents([])
    console.log("HANDLING FILTER HOMEWORK");
    const filters = unfilteredResults.filter(event => event.type.toLowerCase().includes("project"));
    setFilteredEvents(filters); 
  }
}

  function dateFilter(unfilteredResults) {
      console.log(filteredEvents[0].start_date + "STARTING DATE");
      // const filteredEvents = unfilteredResults.sort((a,b) => b.start_date["_seconds"] - a.start_date["_seconds"]);
      let filtered = [];
      let n = unfilteredResults.length;
      for(let i = 0; i<unfilteredResults.length(); i++) {
        for(let j = 0; j<n-i-1; j++) {
          if(unfilteredResults[j].start_date["_seconds"] > unfilteredResults[j+1].start_date["_seconds"]) {
            let temp = unfilteredResults[j];
            unfilteredResults[j] = unfilteredResults[j+1];
            unfilteredResults[j+1] = temp;
          }
        }
      }
      setFilteredEvents(unfilteredResults);
  }

  //Filtering Events based on the type with typing

  return (
    <div className="SearchForm">
      <div style={{ 'marginLeft': '80px' }}>
        <div className="App">
        <TextField 
            style = {{
              width: "25%",
              marginTop: '3%',
              color:"black"
            }} 
            value = {input}
            label="Search posts"
            onChange={e => setInput(e.target.value)}
        />
        <Button variant="contained" style = {{margin: "2.5% 0% 2.5% 1%"}} color="primary" onClick= { async()=> { 
          await handleSubmit(); 
        }}>
          Search Events
        </Button>
        <div style={{display: 'flex', flexDirection: 'row'}}>
          <div>
            <OuterDiv>
              <Typography use="headline6" style={{textAlign: 'center', color: 'white', backgroundColor: '#333333'}}>
                FILTERS
              </Typography>
              {/* Chceckboxes to sort filter. */}
              <Typography style={{textAlign:'center'}} use="headline6">
                Type
              </Typography>
              <Checkbox style={{marginLeft: '5px'}}label="Games" onChange={()=> {
                if(games == false) {
                  setGames(true);
                }
                else {
                  setGames(false);
                }
                }}
              />
              <Checkbox style={{marginLeft: '5px'}} label="Homework" onChange={()=> {
                if(homework == false) {
                  setHomework(true);
                }
                else {
                  setHomework(false);
                }
                }}
              />
              <Checkbox style={{marginLeft: '5px'}} label="Projects" onChange={()=> {
                if(projects == false) {
                  setProjects(true);
                }
                else {
                  setProjects(false);
                }
                }}
              />
              <Typography style = {{textAlign:'center'}} use="headline6">
                Sort by
                </Typography>
                <Checkbox style={{marginLeft: '5px'}} label = "Date" />
              </OuterDiv>
            </div>
            <div style={{display: 'flex', alignItems: 'center', marginLeft: '15px', flexWrap: 'wrap'}}>
              {filteredEvents.map(event => {
                // event.status = event.status.toString(); <-- Have yet to test
                //console.log(event.creator_id)
                console.log(event.event_id)
                return (
                  // Printing the title and description of each event, along with the status
                  
                  <>
                    <EventCard
                      user_id = {event.creator_id}       
                      event_id= {event.event_id}
                      />
                      {/* <h1>{ event.start_date["_seconds"] }</h1> */}
                  </>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchForm;