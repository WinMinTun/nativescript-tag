import * as observable from 'data/observable';
import * as pages from 'ui/page';
import {HelloWorldModel} from './main-view-model';
import {TagGroup} from 'nativescript-tag';

let viewModel: HelloWorldModel;
let page: pages.Page;
let tagGroup3: TagGroup;

let tagClickCallback = function onTagClick(tag: string) {
    alert(tag + ' clicked!');
}

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    page = <pages.Page>args.object;
    viewModel = new HelloWorldModel();
    page.bindingContext = viewModel;
    tagGroup3 = <TagGroup>page.getViewById('tag3');
    tagGroup3.ntag_tagClick = tagClickCallback;
}



export function onGetValues() {
    alert(JSON.stringify(page.bindingContext.tags));
    console.log(JSON.stringify(page.bindingContext.tags));
}