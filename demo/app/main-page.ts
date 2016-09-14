import * as observable from 'data/observable';
import * as pages from 'ui/page';
import {HelloWorldModel} from './main-view-model';

let viewModel: HelloWorldModel;
let page;

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    page = <pages.Page>args.object;
    viewModel = new HelloWorldModel();
    page.bindingContext = viewModel;

}

export function onTagClick(tag: string) {
    alert(tag + ' clicked!');
}

export function onGetValues() {
    alert(JSON.stringify(page.bindingContext.tags));
}