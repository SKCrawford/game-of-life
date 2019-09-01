# Game of Life

## Description

This app is a [socket.io server](https://socket.io/) that implements [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), a cellular automaton that simulates population lifecycles. The grid of cells, represented by a 2D array of booleans, is governed by a set of rules that indicate whether cells should live or die. Each grid evolution is represented by a tick number. Given an initial grid and the time between ticks in milliseconds, the server will provide the grid's evolutions at the desired rate.

### Rules

* Each cell has 8 neighbors (even the cells on the edges or in the corners).
* Cells die when they have 0, 1, or 4+ live neighbors.
* Cells revive or stay alive when they have 3 live neighbors.
* Cells maintain their last state when they have 2 live neighbors.

## Server

### Installation

1. Use *git-clone* to clone the repository:

```bash
$ git clone http://github.com/SKCrawford/game-of-life.git
```

2. Install the node modules:

```bash
$ yarn
```

### Usage

1. Build and start the production server:

```
$ yarn start
```

## Client

### Installation

1. Install either [socket.io](https://socket.io/docs/#Installing) or [the standalone socket.io client](https://github.com/socketio/socket.io-client).

### Usage

1. Prepare the socket.

```javascript
const socket = io('http://localhost:8000');
```

2. Prepare the DTO/configuration object. The DTO should contain two properties: `seed` and `delay`. `seed` is the grid of cells as a two-dimensional array of booleans. `delay` is the time between ticks in milliseconds as a number. Be sure to surround your shape with all dead (false) cells as it will loop toroidally.

```javascript
const dto = {
    seed: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false,  true,  true,  true, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ],
    delay: 2000,
};
```

3. Using the socket, subscribe to the `init` event to get the unique ID.

```javascript
socket.on('init', id => {
    /* ... */
})
```

4. Using the socket, emit the DTO to the `id` received from the `init` event.

```javascript
socket.on('init', id => {
    socket.emit(id, dto);
})
```

5. To receive the results, subscribe to the `id` received from the `init` event. 

```javascript
socket.on('init', id => {
    /* emit the dto to id here */
    socket.on(id, payload => {
        console.log('Tick:', payload.tick);
        console.log(payload.grid);
    });
})
```

All together, a successful client call will look like:

```javascript
// Prepare the socket and test grid
const socket = io('http://localhost:8000');
const dto = {
    seed: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false,  true,  true,  true, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
    ],
    delay: 2000,
};

// Request the unique ID, then emit and subscribe to it
socket.on('init', id => {
    // Seed the test grid to the ID channel
    socket.emit(id, dto);

    // Print the grid's evolutions from the ID channel
    socket.on(id, payload => {
        console.log('Tick:', payload.tick);
        console.log(payload.grid);
    });
})
```

### Interfaces

#### DTO

```javascript
interface Dto {
    /** The initial grid of cells. */
    readonly seed: boolean[][];

    /** The delay in milliseconds. */
    readonly delay: number;
}
```

#### Payload

```javascript
interface Payload {
    /** The evolved grid. */
    readonly grid: boolean[][];

    /** The number indicating the lifecycle of the corresponding grid. */
    readonly tick: number;
}
```

## Contributing

Pull requests will not be accepted as this is a personal project.

## License

[MIT](https://choosealicense.com/licenses/mit/) 
