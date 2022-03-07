import { Component, OnInit } from '@angular/core';
import { LibraryService } from 'src/app/library.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-create-session',
  templateUrl: './create-session.component.html',
  styleUrls: ['./create-session.component.css']
})
export class CreateSessionComponent implements OnInit {
  uuid = uuidv4();

  constructor(private libraryService: LibraryService) { }

  ngOnInit(): void {}

  register() {
    this.libraryService.registerSession(this.uuid);
  }
}
