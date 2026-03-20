import { Component, inject, OnInit, signal } from '@angular/core';
import { appInfo } from '@app/app.info';
import { HttpClient } from '@angular/common/http';
import { UrlConstant } from '@app/const/url-constant';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-info',
  imports: [JsonPipe],
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  private readonly httpClient = inject(HttpClient);

  public clientInfo = appInfo;
  public serverInfo = signal<object | null>(null);

  public ngOnInit(): void {
    this.httpClient.get(UrlConstant.ACTUATOR_INFO).subscribe((info) => this.serverInfo.set(info));
  }
}
