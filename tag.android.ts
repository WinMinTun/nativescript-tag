/**
 * @author Win Min Tun
 * @version 1.0
 */
import * as common from "./tag.common";
import app = require("application");
import proxy = require("ui/core/proxy");

declare var me;
declare var java;

function onValuePropertyChanged(data) {
    var tagGroup = data.object;
    if (!tagGroup.android) {
        return;
    }
    
    // change array to java.util.List
    let tagList = java.util.Arrays.asList(data.newValue);
    tagGroup.android.setTags(tagList);
}

// common.TagGroup.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
// register callback to natively change tags when change at TagGroup.value property occurs (e.g. binding)
(<proxy.PropertyMetadata>common.TagGroup.valueProperty.metadata).onSetNativeValue = onValuePropertyChanged;

require("utils/module-merge").merge(common, module.exports);

export class TagGroup extends common.TagGroup {


    // the tags
    value: string[];

    private _android: any;
    private _ios: any;

    constructor() {
        super();        
    }

    get android() {
        return this._android;
    }

    // create native ui
    _createUI() {

        // for android, the library is included at platforms/android/include.gradle
        this._android = new me.gujun.android.taggroup.TagGroup(this._context);

        var that = new WeakRef(this);
        var changeListener = new me.gujun.android.taggroup.TagGroup.OnTagChangeListener({
            onAppend: function(tagGroup, newTag: string){
                var instance = that.get();
                if(instance) {
                    let newTags = java.util.Arrays.asList(tagGroup.getTags());
                    newTags.add(newTag);
                    instance._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray(new java.lang.String[newTags.size()]));
                }
            },

            onDelete: function(tagGroup, deletedTag: string) {
                var instance = that.get();
                if(instance) {
                    let newTags = java.util.Arrays.asList(tagGroup.getTags());
                    newTags.remove(deletedTag);
                    instance._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray(new java.lang.String[newTags.size()]));
                }
            }
        });

        // register OnTagChangeListener to reflect TagGroup.value property upon UI changes
        this._android.setOnTagChangeListener(changeListener);
    }
}
