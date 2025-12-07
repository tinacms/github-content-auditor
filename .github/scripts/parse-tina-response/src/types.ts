interface GraphQLResponse<T = {}> {
    data: {
        [key: string]: {
            edges: Array<Edge<T>>;
        }
    }
}

interface Edge<T = {}> {
    node: {
        _sys: {
            path: string;
        }
    } & T;
}

interface AuditableContent {
    lastChecked: string;
}

interface ITinaClient<T = {}> {
     getContent: ()=> Promise<GraphQLResponse <T>>;
}

type FileData = {
    path: string;
    content: string;
}

export type { GraphQLResponse, Edge, FileData , ITinaClient, AuditableContent};