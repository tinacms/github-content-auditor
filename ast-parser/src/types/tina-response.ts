interface TinaResponse<T = unknown> {
    data: {

    }
}

interface Connection {
    [key: string]: {

    }
}

interface Edge <T extends unknown> {
    node: T;
}