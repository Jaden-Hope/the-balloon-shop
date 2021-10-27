module.exports = (pool, validColours) => {


    // insert valid colours into the database here
    async function addValidColours() {
        for (let i = 0; i < validColours.length; i++) {
            await pool.query('INSERT INTO valid_colours (colour_name, count) VALUES ($1, 0)', [validColours[i]]);
        }
    }

    async function getValidColours() {
        return await pool.query('SELECT colour_name FROM valid_colours');
    }

    async function requestColour(colour) {
        if (await (await pool.query('SELECT * FROM valid_colours WHERE colour_name=$1', [colour])).rows === []) {
            let counter = await (await pool.query('SELECT count FROM valid_colours WHERE colour_name=$1', [colour])).rows[0].count;
            counter++;
            await pool.query('UPDATE valid_colours SET count = $1', [counter]);
        } else {
            if (await (await pool.query('SELECT * FROM invalid_colours WHERE colour_name=$1', [colour])).rows === []) {
                let counter = await (await pool.query('SELECT count FROM valid_colours WHERE colour_name=$1', [colour])).rows[0].count;
                counter++;
                await pool.query('UPDATE invalid_colours SET count = $1', [counter++]);
            } else {
                await pool.query('INSERT INTO invalid_colours (colour_name, count) VALUES ($1, 1)', [colour]);
            }
        }
    }

    async function colourCount(colour) {
        if (await (await pool.query('SELECT * FROM valid_colours WHERE colour_name=$1', [colour])).rows === []) {
            console.log(await pool.query('SELECT * FROM valid_colours'));
            console.log(await (await pool.query('SELECT count FROM valid_colours WHERE colour_name=$1', [colour])).rows);
            return await (await pool.query('SELECT count FROM valid_colours WHERE colour_name=$1', [colour])).rows.count;
        } else {
            console.log(await (await pool.query('SELECT count FROM invalid_colours WHERE colour_name=$1', [colour])).rows);
            console.log(await pool.query('SELECT * FROM invalid_colours'));

            return await (await pool.query('SELECT count FROM invalid_colours WHERE colour_name=$1', [colour])).rows.count;
        }
    }

    async function getInvalidColours() {
        return await (await pool.query('SELECT colour_name FROM invalid_colours'));
    }

    async function allColours() {
        const valid = await (await pool.query('SELECT * FROM valid_colours')).rows;
        const invalid = await (await pool.query('SELECT * FROM invalid_colours')).rows;

        let allColours = [];

        valid.forEach((item) => {
            allColours.push(item.colour_name);
        })

        invalid.forEach((item) => {
            allColours.push(item.colour_name);
        })

        return allColours;
    }

    return {
        getValidColours,
        requestColour,
        colourCount,
        getInvalidColours,
        allColours,
        addValidColours
    }
}