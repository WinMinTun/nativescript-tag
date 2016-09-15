# Nativescrpt UI plugin for Tagging

## Platform Support

Currently only support Android. Any collaborator for iOS support is welcomed!

##Android side
![alt tag](https://bytebucket.org/win_min_tun/nativescript-tag/raw/a498db5bf1dfba22dc13e50b6f275af72ba8561a/demo/screenshots/Android.png)

## Usage

The plugin is developed using nativescript plugin seed (https://github.com/NathanWalker/nativescript-plugin-seed). Pls see `demo` for full example. 
###
```XML
    <Label text="Editable (Default size, Custom Color)" textWrap="true" />    
    <Tags:TagGroup id="tag1" ntag_editMode="true" value="{{ tags }}" ntag_borderColor="#2095F2" ntag_textColor="#2095F2" ntag_backgroundColor="#ffffff" ntag_checkedBorderColor="#2095F2" ntag_checkedBackgroundColor="#2095F2" ntag_checkedTextColor="#ffffff" />

    <Label text="Read-only (Custom size, Default Color)" textWrap="true" />    
    <Tags:TagGroup id="tag2" ntag_tagClick="{{ onTagClick }}" value="{{ tags }}" ntag_borderStrokeWidth="0.7" ntag_textSize="15" ntag_horizontalSpacing="9" ntag_verticalSpacing="5" ntag_horizontalPadding="14" ntag_verticalPadding="4" />

    <Label text="Read-only (Small size, Default Color)" textWrap="true" />
    <Tags:TagGroup id="tag3" value="{{ tags }}" ntag_small="true" />

    <Label text="Read-only (Large size, Default Color)" textWrap="true" />
    <Tags:TagGroup id="tag3" ntag_tagClick="{{ onTagClick }}" value="{{ tags }}" ntag_large="true" />

    <Label text="Editable (Custom input hint)" textWrap="true" />
    <Tags:TagGroup id="tag4" ntag_tagClick="{{ onTagClick }}" value="{{ tags }}" ntag_inputHint="New Tag" ntag_large="true" />

```

###
- How to add tag?
Set `ntag_editMode="true"` in xml and press 'Enter' or tap the blank area of the tag group. (A few soft keyboard not honour the key event).

- How to remove tag?
Set `ntag_editMode="true"` in xml and press 'Backspace' or double-tap the tag to remove.

## Attributes

### Important attributes

- **value** - *required*

String array of tags for binding

- **ntag_editMode - (boolean)** - *optional*

Default is `false` - read only. When true, can remove and add tags by double tapping and tapping the blank area of the tag group respectively. Mutually exclusive to `ntag_tagClick` due to the native android library.

- **ntag_tagClick** - *optional*

Tag click event. Mutually exclusive to `ntag_editMode=true` due to the native android library.

- **ntag_small or ntag_large - (boolean)** - *optional*

Preset tag sizes. Mutually execlusive.

- **ntag_inputHint - (string)** - *optional*

Default is 'Add Tag'

### Color attributes

- **ntag_borderColor - (string)** - *optional*

Default is #49C120

- **ntag_textColor - (string)** - *optional*

Default is #49C120

- **ntag_backgroundColor - (string)** - *optional*

Default is #FFFFFF

- **ntag_dashBorderColor - (string)** - *optional*

Default is #AAAAAA

- **ntag_inputHintColor - (string)** - *optional*

Default is #80000000

- **ntag_inputTextColor - (string)** - *optional*

Default is #DE000000

- **ntag_checkedBorderColor - (string)** - *optional*

Default is #49C120

- **ntag_checkedTextColor - (string)** - *optional*

Default is #FFFFFF

- **ntag_checkedMarkerColor - (string)** - *optional*

Default is #FFFFFF

- **ntag_checkedBackgroundColor - (string)** - *optional*

Default is #49C120

- **ntag_pressedBackgroundColor - (string)** - *optional*

Default is #EDEDED

### Size attributes

- **ntag_textSize - (number)** - *optional*

Default is 13sp

- **ntag_borderStrokeWidth - (number)** - *optional*

Default is 0.5dp

- **ntag_horizontalSpacing - (number)** - *optional*

Default is 8dp

- **ntag_verticalSpacing - (number)** - *optional*

Default is 4dp

- **ntag_horizontalPadding - (number)** - *optional*

Default is 12dp

- **ntag_verticalPadding - (number)** - *optional*

Default is 3dp

## Credit

Credit goes to the native android library (https://github.com/2dxgujun/AndroidTagGroup) by 2dxgujun (https://github.com/2dxgujun)

## Contributing - Support for iOS?

Currently there is no support for iOS. Any suggestion (iOS library, etc) and/or contribution is welcomed!
