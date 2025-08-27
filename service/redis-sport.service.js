import client from "../database/redis.js";
import axios from "axios";

export const getCompetitionList = async (sportId) =>{
    try {
        const competitionListEX = await axios.get(`http://178.79.147.85:8000/api/data/competition/${sportId}`);
        return competitionListEX.data.competitions; 
    } catch (error) {
        console.error("Error calling betfair competition API: ",error.response?.data || error.message);
        throw new Error("Failed to fetch data from Betfair");
    }
};

export const getEventList = async (competitionId) =>{
    try {
        const eventListEX = await axios.get(`http://178.79.147.85:8000/api/data/event/${competitionId}`);
        // console.log(eventListEX.data.events)
        return eventListEX.data.events; 
    } catch (error) {
        console.error("Error calling betfair Event API: ",error.response?.data || error.message);
        throw new Error("Failed to fetch data from Betfair");
    }
};

export const getMarketList = async (eventId) =>{
    try {
        const marketListEX = await axios.get(`http://178.79.147.85:8000/api/data/market/${eventId}`);
        // console.log(marketListEX.data.markets)
        return marketListEX.data.markets; 
    } catch (error) {
        console.error("Error calling betfair Market API: ",error.response?.data || error.message);
        throw new Error("Failed to fetch data from Betfair");
    }
};

export const getBookList = async (marketId) =>{
    try {
        const bookListEX = await axios.get(`http://178.79.147.85:8000/api/data/book/${marketId}`);
        // console.log(bookListEX.data.marketBook)
        return bookListEX.data.marketBook; 
    } catch (error) {
        console.error("Error calling betfair Market Book API: ",error.response?.data || error.message);
        throw new Error("Failed to fetch data from Betfair");
    }
};

export const getAllEventList = async (sportId) =>{
    try {
        const allEventListEX = await axios.get(`http://178.79.147.85:8000/api/data/all-event/${sportId}`);
        // console.log(allEventListEX.data.events)
        return allEventListEX.data.events; 
    } catch (error) {
        console.error("Error calling betfair All Events API: ",error.response?.data || error.message);
        throw new Error("Failed to fetch data from Betfair");
    }
};