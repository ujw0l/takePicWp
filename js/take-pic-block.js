
const jsMas = new jsMasonry();
const { useEffect } = React;
const el = wp.element.createElement;
const { SelectControl, PanelBody, CheckboxControl, RangeControl, Modal, Button } = wp.components;
const __ = wp.i18n.__;
const { InspectorControls, RichText } = wp.blockEditor;
const { useState } = wp.element;
const imgList = Object.keys(takePic.files).map(x => takePic.dirUrl + '/' + takePic.files[x]);

wp.blocks.registerBlockType('take-pic/take-pic-block', {
    title: __("Take Pic", 'take-pic'),
    icon: 'images-alt',
    description: __("Take Pic image embed", 'take-pic'),
    category: 'media',
    keywords: [__('take pic', 'take-pic'), __('webcam', 'take-pic')],
    attributes: {
        img: { type: 'string', default: imgList[imgList.length - 1] },
        title: { type: 'string', default: __('Choose title', 'take-pic') }
    },
    example: {

    },
    edit: props => {
        const [isOpen, setOpen] = useState(false);
        return el('div', null, el('div', {},
            el('img', { src: props.attributes.img })),
            el(RichText, { tag: 'p', allowedFormats: [], onChange: val => props.setAttributes({ title: val }), value: props.attributes.title, placeholder: props.attributes.title }),
            el('div', { style: { padding: '10px', backgroundColor: 'rgba(255,255,255,1)' } },
                el(Button, { style: { border: '1px solid rgba(0,0,0,1)', marginLeft: 'auto', marginRight: 'auto', display: 'block' }, variant: 'secondary', onClick: () => setOpen(true) }, __('Select Image', 'take-pic')),

                isOpen && el(Modal, { title: __('Select Image', 'take-pic'), onRequestClose: () => setOpen(false), },

                    el('div', {}, imgList.map(x => {
                        let isChecked = props.attributes.img == x ? true : false;
                        return el('div', { style: { margin: '1%', width: '31%', display: 'inline-block' } },
                            el('img', { style: { width: '100%' }, src: x },),
                            el(CheckboxControl, {
                                checked: isChecked,
                                onChange: val => {
                                    if (val) {
                                        props.setAttributes({ img: x });
                                    }
                                }
                            }),
                        )
                    }),
                    ),
                    el(Button, { style: { float: 'right', marginBottom: '10px', border: '1px solid rgba(0,0,0,1)' }, variant: "secondary", onClick: () => setOpen(false) }, __('Done', 'take-pic')),
                )),
        )
    },
    save: props => el('div', {}, el('img', { src: props.attributes.img }), el('p', null, props.attributes.title))
});

wp.blocks.registerBlockType('take-pic/take-pic-gallery-block', {
    title: __("Take Pic Gallery", 'take-pic'),
    icon: 'format-gallery',
    description: __("Take Pic gallery embed", 'take-pic'),
    category: 'media',
    keywords: [__('take pic gallery', 'take-pic'), __('webcam', 'take-pic')],
    attributes: {
        imgGal: { type: 'Array', default: [] },
        imgWidth: { type: 'Number', default: 48 },
        galTitle: { type: 'String', default: __('Choose gallery title', 'take-pic') }
    },
    example: {

    },
    edit: ({ attributes, setAttributes }) => {
        const [isOpen, setOpen] = useState(false);
        useEffect(() => {
            Array.from(document.querySelectorAll('.takePicImgGal Img')).map(x => x.style.width = '');
            jsMas.prepMas('.takePicImgGal');
            setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        }, [attributes.imgGal, attributes.imgWidth]);

        return el('div', null, el('div', {},
            el('div', { className: 'takePicImgGal' },
                1 <= attributes.imgGal.length ? attributes.imgGal.map(x => x != undefined || x != null ? el('img', { width: `${attributes.imgWidth}%`, src: x }) : '') : '',
            ),
            el(RichText, { tag: 'p', allowedFormats: [], onChange: val => setAttributes({ galTitle: val }), value: attributes.galTitle, placeholder: attributes.galTitle }),
            el('div', {},

                el('div', { style: { padding: '10px', backgroundColor: 'rgba(255,255,255,1)' } },
                    el(Button, { style: { border: '1px solid rgba(0,0,0,1)', marginLeft: 'auto', marginRight: 'auto', display: 'block' }, variant: 'secondary', onClick: () => setOpen(true) }, __('Select Images', 'take-pic'))),
                isOpen && el(Modal, { title: __('Select/Update Images', 'take-pic'), onRequestClose: () => setOpen(false), },
                    el('div', {}, imgList.map(x => {
                        return el('div', { className: 'TakePicGal', style: { margin: '1%', width: '31%', display: 'inline-block' } },
                            el('img', { style: { width: '100%' }, src: x },),
                            el(CheckboxControl, {
                                checked: attributes.imgGal.includes(x),
                                onChange: () => {
                                    setAttributes({
                                        imgGal: Array.from(document.querySelectorAll('.TakePicGal')).map(y => {
                                            if (y.querySelector('.components-checkbox-control__input').checked) {
                                                return y.querySelector('img').src
                                            }
                                        })
                                    })

                                }
                            }),
                        )
                    })),

                    el(Button, { style: { float: 'right', marginBottom: '10px', border: '1px solid rgba(0,0,0,1)' }, variant: "secondary", onClick: () => setOpen(false) }, __('Done', 'take-pic')),

                ),
            )
        ),
            el(InspectorControls, null,
                el(PanelBody, null,
                    el('div', {},
                        el(RangeControl, {
                            label: __('Gallery image width in percent (%)', 'take-pic'),
                            min: 1,
                            max: 100,
                            value: attributes.imgWidth,
                            onChange: val => setAttributes({ imgWidth: val }),
                        }),
                    ),
                ))
        )
    },
    save: ({ attributes }) => el('div', { className: 'takePicImgGalContainer' },

        el('div', { style: { opacity: '0' }, className: 'takePicImgGal' },
            attributes.imgGal.map(x => undefined != x || null != x ? el('img', { style: { width: `${attributes.imgWidth}%` }, src: x }) : ''),
        ),
        el('p', {}, attributes.galTitle),
    )
});