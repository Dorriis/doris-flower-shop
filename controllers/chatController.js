const axios = require('axios');
const Chat = require('../models/chatModel');


const handleChatMessage = async (req, res) => {
    const { message, user } = req.body;
    try {

        const response = await getAIResponse(message);

        const chat = new Chat({
            message,
            user,
            response,
        });

        await chat.save();

        res.json({ response });
    } catch (error) {
        console.error('Error handling chat message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getAIResponse = async (message) => {
    if (message.toLowerCase().includes('price') || message.toLowerCase().includes('cost')) {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const prices = data.map((product) => `${product.name}: $${product.price}`).join('\n');
        return `The prices are:\n${prices}`;
    }

    if (message.toLowerCase().includes('color')) {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const colors = data.map((product) => `${product.name}: ${product.color}`).join('\n');
        return `Here are the colors available:\n${colors}`;
    }

    if (message.toLowerCase().includes('image') || message.toLowerCase().includes('photo')) {
        const { data } = await axios.get('http://localhost:5000/api/products');
        const images = data.map((product) => `${product.name}: ${product.img}`).join('\n');
        return `Here are the images:\n${images}`;
    }


    return 'Sorry, I did not understand your question.';
};

module.exports = { handleChatMessage };
