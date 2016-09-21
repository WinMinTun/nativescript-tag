/**
 * @author Win Min Tun
 * @version 1.0
 */
import * as common from "./tag.common";
import app = require("application");
import proxy = require("ui/core/proxy");
import color_1 = require('color');

declare var me;
declare var java;
declare var android; // to compile-pass "android.R.layout.simple_list_item_1"
declare var Array;

function onValuePropertyChanged(data) {
    var tagGroup: TagGroup = data.object;
    if (!tagGroup.android) {
        return;
    }
    
    // change array to java.util.List
    let tagList = java.util.Arrays.asList(data.newValue);
    tagGroup.tagGroup.setTags(tagList);

    // remove the last 'Add Tag' if auto complete
    if (tagGroup.ntag_autoComplete) {
        tagGroup.tagGroup.removeViewAt(tagGroup.tagGroup.getChildCount() - 1);
    }
}

// common.TagGroup.valueProperty.metadata.onSetNativeValue = onValuePropertyChanged;
// register callback to natively change tags when change at TagGroup.value property occurs (e.g. binding)
(<proxy.PropertyMetadata>common.TagGroup.valueProperty.metadata).onSetNativeValue = onValuePropertyChanged;

require("utils/module-merge").merge(common, module.exports);


export class TagGroup extends common.TagGroup {


    // the tags
    value: string[];
    // autocomplete tag suggestions
    private _autoCompleteTags: Array<string>;

    private _android: any;
    private _ios: any;

    private _tagGroup: any;
    private _autoCompleteTextView: any;

    public static TAG_CLICK_EVENT = 'ntag_tagClick';


    // tag edit mode [false = read-only]
    public ntag_editMode: boolean = false;

    // auto complete mode (mutually exclusive to ntag_editMode)
    public ntag_autoComplete: boolean = false;

    // tag click callback (mutually exclusive to ntag_editMode according to the android plugin)
    public ntag_tagClick;

    // view properties (Colors)
    public ntag_borderColor: string; // default: #49C120
    public ntag_textColor: string; // default: #49C120
    public ntag_bgColor: string; // default: #FFFFFF
    public ntag_dashBorderColor: string; // default: #AAAAAA
    public ntag_inputHintColor: string; // default: #80000000
    public ntag_inputTextColor: string; // default: #DE000000
    public ntag_checkedBorderColor: string; // default: #49C120
    public ntag_checkedTextColor: string; // default: #FFFFFF
    public ntag_checkedMarkerColor: string; // default: #FFFFFF
    public ntag_checkedBgColor: string; // default: #49C120
    public ntag_pressedBgColor: string; // default: #EDEDED
    public ntga_acPopupBg: string; // default: #F5F8FA;

    // view properties (Input hint, Text Size and spacings)
    public ntag_inputHint: string; // default: Add Tag
    public ntag_textSize: number; // default: 13sp
    public ntag_borderStrokeWidth: number; // default: 0.5dp
    public ntag_hSpacing: number; // default: 8dp
    public ntag_vSpacing: number; // default: 4dp
    public ntag_hPadding: number; // default: 12dp
    public ntag_vPadding: number; // default: 3dp

    // preset tag sizes (mutually execulsive)
    public ntag_small: boolean;
    public ntag_large: boolean;

    constructor() {
        super();        
    }

    get android() {
        return this._android;
    }

    get tagGroup() {
        return this._tagGroup;
    }

    set autoCompleteTags(val: Array<string>) {
        this._autoCompleteTags = val;
        if (val) {
            this.autoCompleteTagsUpdate(val);
        }
    }

    get autoCompleteTags(): Array<string> {
        return this._autoCompleteTags;
    }

    // create native ui
    _createUI() {

        // for android, the library is included at platforms/android/include.gradle
        this._tagGroup = new me.gujun.android.taggroup.TagGroup(this._context);

        this.styleTags(); // style the tags

        // if edit mode
        if (this.ntag_editMode) {

            // the same as android plugin TagGroup constructor
            let f = this._tagGroup.getClass().getDeclaredField("isAppendMode"); //NoSuchFieldException
            f.setAccessible(true);
            f.setBoolean(this._tagGroup, true); //IllegalAccessException

             // the root is the TagGroup when not auto complete
            this._android = this._tagGroup;
                
            let tagGroup = this._tagGroup;
            var tagGroupClickListener = new android.view.View.OnClickListener({
                onClick: function(view) {
                    tagGroup.submitTag();
                }
            });

            this._tagGroup.appendInputTag();
            this._tagGroup.setOnClickListener(tagGroupClickListener);
            
        } else if (this.ntag_autoComplete) { // if auto complete

            // the android plugin does not support auto complete, so extend it here

            let f = this._tagGroup.getClass().getDeclaredField("isAppendMode"); //NoSuchFieldException
            f.setAccessible(true);
            f.setBoolean(this._tagGroup, true); //IllegalAccessException
				
            let AutoCompleteTextView = android.widget.AutoCompleteTextView;
            let LinearLayout = android.widget.LinearLayout;
            let LayoutParams = android.widget.LinearLayout.LayoutParams;
            let context = app.android.context;

            let root = new LinearLayout(context);

            root.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT));
            root.setOrientation(LinearLayout.VERTICAL);

            this._autoCompleteTextView = new AutoCompleteTextView(context);
            this._autoCompleteTextView.setThreshold(1);

            let that = new WeakRef(this);
            let tagGroup = this._tagGroup;
            let autoComplete = this._autoCompleteTextView;

            // append tag on item clicked
            this._autoCompleteTextView.setOnItemClickListener(new android.widget.AdapterView.OnItemClickListener({
                onItemClick: function (parent, view, position, id) {
                    var owner = that.get();
                    if (owner) {
                        let currentTags = tagGroup.getTags();
                        let newTags = new java.util.ArrayList(java.util.Arrays.asList(currentTags));
                        newTags.add(parent.getItemAtPosition(position));

                        // add tags natively
                        tagGroup.setTags(newTags);
                        // remove the last 'Add Tag'
                        tagGroup.removeViewAt(tagGroup.getChildCount() - 1);

                        // notify TagGroup.value (**other tags) of the native change
                        owner._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray());
                        autoComplete.setText(null); // clear text
                    }
                }
            }));

            // append tag on textview clicked
            this._autoCompleteTextView.setOnClickListener(new android.view.View.OnClickListener({
                onClick: function (view) {
                    if (view.getText().toString()) {
                        var owner = that.get();
                        if (owner) {
                            let currentTags = tagGroup.getTags();
                            let newTags = new java.util.ArrayList(java.util.Arrays.asList(currentTags));
                            newTags.add(view.getText().toString());

                            // add tags natively
                            tagGroup.setTags(newTags);
                            // remove the last 'Add Tag'
                            tagGroup.removeViewAt(tagGroup.getChildCount() - 1);

                            // notify TagGroup.value (**other tags) of the native change
                            owner._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray());
                            view.setText(null); // clear text
                        }
                    }
                    
                }
            }));


            this.styleAutoComplete(); // style auto complete

            root.addView(this._autoCompleteTextView);
            root.addView(this._tagGroup);

            // if auto complete, the root is linear layout with AutoCompleteTextView & TagGroup
            this._android = root;

        } else { // if read only mode

                // the root is the TagGroup when read only
                this._android = this._tagGroup;
        }    

        let that = new WeakRef(this);
        var tagChangeListener = new me.gujun.android.taggroup.TagGroup.OnTagChangeListener({
            onAppend: function(tagGroup, newTag: string){
                var instance = that.get();
                if (instance) {
                    let newTags = new java.util.ArrayList(java.util.Arrays.asList(tagGroup.getTags()));
                    // notify TagGroup.value of the native change
                    instance._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray());
                }
            },

            onDelete: function(tagGroup, deletedTag: string) {
                var instance = that.get();
                if (instance) {
                    let newTags = new java.util.ArrayList(java.util.Arrays.asList(tagGroup.getTags()));
                    // notify TagGroup.value of the native change
                    instance._onPropertyChangedFromNative(TagGroup.valueProperty, newTags.toArray());
                }
            }
        });

        // register OnTagChangeListener to reflect TagGroup.value property upon UI changes
        this._tagGroup.setOnTagChangeListener(tagChangeListener);


        let tagClickListener = new me.gujun.android.taggroup.TagGroup.OnTagClickListener({
            onTagClick: function(tag: string) {
                let instance = that.get();
                if(instance && instance.ntag_tagClick) {
                    // onClick event
                    instance.notify({ eventName: TagGroup.TAG_CLICK_EVENT, object: instance, data: tag });

                    // onClick for binded function
                    if (typeof(instance.ntag_tagClick) === 'function') {
                        instance.ntag_tagClick(tag);
                    }
                }
            }
        });
        
        // register tag click listener
        this._tagGroup.setOnTagClickListener(tagClickListener);

    }

    // set suggestions to autocomplete textview
    private autoCompleteTagsUpdate(val) {
        
        let ArrayAdapter = android.widget.ArrayAdapter;
        let arr = Array.create(java.lang.String, val.length);
        val.forEach(function (item, index) {
            arr[index] = item;
        });

        let adapter = new ArrayAdapter(this._context, android.R.layout.simple_list_item_1, arr);
        this._autoCompleteTextView.setAdapter(adapter);
    }

    // style autocomplete textview
    private styleAutoComplete() {
        if (!this.ntag_inputTextColor) {
            this._autoCompleteTextView.setTextColor(new color_1.Color('#DE000000').android);
        } else {
            this._autoCompleteTextView.setTextColor(new color_1.Color(this.ntag_inputTextColor).android);
        }

        if (!this.ntga_acPopupBg) {
            this._autoCompleteTextView.setDropDownBackgroundDrawable(new android.graphics.drawable.ColorDrawable(new color_1.Color('#F5F8FA').android));
        } else {
            this._autoCompleteTextView.setDropDownBackgroundDrawable(new android.graphics.drawable.ColorDrawable(new color_1.Color(this.ntga_acPopupBg).android));
        }

        if (this.ntag_inputHint) {
            this._autoCompleteTextView.setHint(this.ntag_inputHint);
        }

        if (!this.ntag_inputHintColor) {
            this._autoCompleteTextView.setHintTextColor(new color_1.Color('#80000000').android);
        } else {
            this._autoCompleteTextView.setHintTextColor(new color_1.Color(this.ntag_inputHintColor).android);
        }

        if (!this.ntag_textSize) {
            let textSize = this._tagGroup.sp2px(13.0);
            this._autoCompleteTextView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, textSize);
        } else {
            let textSize = this._tagGroup.sp2px(this.ntag_textSize);
            this._autoCompleteTextView.setTextSize(android.util.TypedValue.COMPLEX_UNIT_PX, textSize);
        }
        
    }

    // Style the tags
    private styleTags() {

        // style colors
        let AndroidColor = android.graphics.Color;

        if (this.ntag_borderColor) {
            let f = this._tagGroup.getClass().getDeclaredField("borderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_borderColor)); //IllegalAccessException
        }

        if (this.ntag_textColor) {
            let f = this._tagGroup.getClass().getDeclaredField("textColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_textColor)); //IllegalAccessException
        }

        if (this.ntag_bgColor) {
            let f = this._tagGroup.getClass().getDeclaredField("backgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_bgColor)); //IllegalAccessException
        }

        if (this.ntag_dashBorderColor) {
            let f = this._tagGroup.getClass().getDeclaredField("dashBorderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_dashBorderColor)); //IllegalAccessException
        }

        if (this.ntag_inputHintColor) {
            let f = this._tagGroup.getClass().getDeclaredField("inputHintColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_inputHintColor)); //IllegalAccessException
        }

        if (this.ntag_inputTextColor) {
            let f = this._tagGroup.getClass().getDeclaredField("inputTextColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_inputTextColor)); //IllegalAccessException
        }

        if (this.ntag_checkedBorderColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedBorderColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedBorderColor)); //IllegalAccessException
        }

        if (this.ntag_checkedTextColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedTextColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedTextColor)); //IllegalAccessException
        }

        if (this.ntag_checkedMarkerColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedMarkerColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedMarkerColor)); //IllegalAccessException
        }

        if (this.ntag_checkedBgColor) {
            let f = this._tagGroup.getClass().getDeclaredField("checkedBackgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_checkedBgColor)); //IllegalAccessException
        }

        if (this.ntag_pressedBgColor) {
            let f = this._tagGroup.getClass().getDeclaredField("pressedBackgroundColor"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, AndroidColor.parseColor(this.ntag_pressedBgColor)); //IllegalAccessException
        }

        // style preset sizes
        if ((this.ntag_small || this.ntag_large) && !(this.ntag_small && this.ntag_large)) {

            let textSize;
            let hSpacing;
            let vSpacing;
            let hPadding;
            let vPadding;

            if (this.ntag_small) {
                textSize = 10;
                hSpacing = 6;
                vSpacing = 3;
                hPadding = 8;
                vPadding = 2;
            } else if (this.ntag_large) {
                textSize = 15;
                hSpacing = 9;
                vSpacing = 5;
                hPadding = 14;
                vPadding = 4;
                let f = this._tagGroup.getClass().getDeclaredField("borderStrokeWidth");
                f.setAccessible(true);
                f.setFloat(this._tagGroup, this._tagGroup.dp2px(0.7));
            }
            let f = this._tagGroup.getClass().getDeclaredField("textSize");
            f.setAccessible(true);
            f.setFloat(this._tagGroup, this._tagGroup.sp2px(textSize));
            f = this._tagGroup.getClass().getDeclaredField("horizontalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(hSpacing));
            f = this._tagGroup.getClass().getDeclaredField("verticalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(vSpacing));
            f = this._tagGroup.getClass().getDeclaredField("horizontalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(hPadding));
            f = this._tagGroup.getClass().getDeclaredField("verticalPadding");
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(vPadding));
        }

        // style custom sizes
        if (this.ntag_textSize) {
            let f = this._tagGroup.getClass().getDeclaredField("textSize"); //NoSuchFieldException
            f.setAccessible(true);
            f.setFloat(this._tagGroup, this._tagGroup.sp2px(this.ntag_textSize)); //IllegalAccessException
        }

        if (this.ntag_borderStrokeWidth) {
            let f = this._tagGroup.getClass().getDeclaredField("borderStrokeWidth"); //NoSuchFieldException
            f.setAccessible(true);
            f.setFloat(this._tagGroup, this._tagGroup.dp2px(this.ntag_borderStrokeWidth)); //IllegalAccessException
        }

        if (this.ntag_hSpacing) {
            let f = this._tagGroup.getClass().getDeclaredField("horizontalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_hSpacing)); //IllegalAccessException
        }

        if (this.ntag_vSpacing) {
            let f = this._tagGroup.getClass().getDeclaredField("verticalSpacing"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_vSpacing)); //IllegalAccessException
        }

        if (this.ntag_hPadding) {
            let f = this._tagGroup.getClass().getDeclaredField("horizontalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_hPadding)); //IllegalAccessException
        }

        if (this.ntag_vPadding) {
            let f = this._tagGroup.getClass().getDeclaredField("verticalPadding"); //NoSuchFieldException
            f.setAccessible(true);
            f.setInt(this._tagGroup, this._tagGroup.dp2px(this.ntag_vPadding)); //IllegalAccessException
        }

        // set input hint text
        if (this.ntag_inputHint) {
            let f = this._tagGroup.getClass().getDeclaredField("inputHint"); //NoSuchFieldException
            f.setAccessible(true);
            f.set(this._tagGroup, this.ntag_inputHint); //IllegalAccessException
        }
    }
}
