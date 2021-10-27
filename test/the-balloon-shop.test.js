let assert = require("assert");
let TheBalloonShop = require("../the-balloon-shop");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://jaden:mypass@localhost:5432/my_balloon_tests';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
});

describe('The balloon function', function () {


    beforeEach(async function () {
        await pool.query("delete from valid_colours;");
        await pool.query("delete from invalid_colours;");

    });

    it('should get the valid colours', async function () {

        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);
        await theBalloonShop.addValidColours();

        const valColours = await (await theBalloonShop.getValidColours()).rows;
        const validColourList = [];

        for (let i = 0; i < valColours.length; i++) {
            validColourList.push(valColours[i].colour_name);
        }

        assert.deepEqual(['Orange', 'Purple', 'Lime'], validColourList);

    });

    it('should get Invalid colours', async function () {

        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);
        await theBalloonShop.addValidColours();

        await theBalloonShop.requestColour('Blue');
        await theBalloonShop.requestColour('Red');
        await theBalloonShop.requestColour('Green');

        const invalColours = await (await theBalloonShop.getInvalidColours()).rows;
        const invalidColourList = [];

        for (let i = 0; i < invalColours.length; i++) {
            invalidColourList.push(invalColours[i].colour_name);
        }

        assert.deepEqual(['Blue', 'Red', 'Green'], invalidColourList);

    });

    it('should return count for a specific colour', async function () {
        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);
        await theBalloonShop.addValidColours();

        await theBalloonShop.requestColour('Orange');
        await theBalloonShop.requestColour('Orange');
        await theBalloonShop.requestColour('Purple');
        await theBalloonShop.requestColour('Orange');
        await theBalloonShop.requestColour('Purple');
        await theBalloonShop.requestColour('Orange');
        await theBalloonShop.requestColour('Lime');

        assert.equal(4, await theBalloonShop.colourCount('Orange'));
        assert.equal(1, theBalloonShop.colourCount('Lime'));
        assert.equal(2, await theBalloonShop.colourCount('Purple'));

    })

    it('should get all the colours - valid & Invalid', async function () {

        const theBalloonShop = TheBalloonShop(pool, ['Orange', 'Purple', 'Lime']);
        await theBalloonShop.addValidColours();

        await theBalloonShop.requestColour('Blue')
        await theBalloonShop.requestColour('Red')

        assert.deepEqual(['Orange', 'Purple', 'Lime', 'Blue', 'Red'], await theBalloonShop.allColours());

    })

    it('an Invalid color should become a valid color after 5 requests', async function () {

        const theBalloonShop = TheBalloonShop(pool, []);
        await theBalloonShop.addValidColours();

        assert.equal([], await theBalloonShop.getValidColours());

        await theBalloonShop.requestColor('Blue')
        await theBalloonShop.requestColor('Blue')
        await theBalloonShop.requestColor('Red')
        await theBalloonShop.requestColor('Blue')
        await theBalloonShop.requestColor('Blue')

        assert.equal(['Blue', 'Red'], await theBalloonShop.getInvalidColours());

        await theBalloonShop.requestColor('Blue')

        assert.equal(['Blue'], await theBalloonShop.getValidColours());
        assert.equal(['Red'], await theBalloonShop.getInvalidColours());

    });

    after(function () {
        pool.end();
    })
});