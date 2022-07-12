import {
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse
} from "@nestjs/websockets";
import {from, map, Observable} from "rxjs";
import {Server, Socket} from "socket.io";

@WebSocketGateway(3001,{ cors: {origin:"*"} })
export class EventsGateway  implements OnGatewayConnection{
    @WebSocketServer()
    serve: Server;

    @SubscribeMessage('events')
    onEvent(@MessageBody() data: unknown): Observable<WsResponse<number>> {
        const event = 'events';
        const response = [1, 2, 3];

        return from(response).pipe(
            map(data => ({event, data})),
        );
    }

    @SubscribeMessage('message')
    test(socket: Socket, payload: { room: string }): any {
        socket.to(payload.room).emit("Hi");
        console.log(payload.room);
    }
    handleConnection(socket: Socket, ...args: any[]): any {
        console.log(socket.client);
    }
}