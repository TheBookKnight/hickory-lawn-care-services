import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";


@Component({
    selector: 'app-root',
    // import the router outlet 
    // to display routed components on the screen
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.css'
})
export class AppComponent {
    title = 'Hickory Lawn Care Services'
}