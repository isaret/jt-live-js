const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World from API!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
