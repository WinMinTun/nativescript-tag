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
    //tagGroup3 = <TagGroup>page.getViewById('tag3');
    //tagGroup3.ntag_tagClick = tagClickCallback;
}

export function tag3Click(args) {
    // args == { eventName: TagGroup.TAG_CLICK_EVENT, object: instance, data: tag }
    alert(args.data + ' clicked!');
}



export function onGetValues() {
    page.bindingContext.tags.forEach(element => {
        console.log(element);
    });
}