import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { SharedModule } from "./shared/shared.module";
import { TasksModule } from "./tasks/tasks.module";
import { TodoComponent } from "./tasks/todo/todo.component";

@NgModule({
    declarations: [AppComponent, HeaderComponent],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule,
        SharedModule,
        TasksModule,
        TodoComponent
    ]
})
export class AppModule { }