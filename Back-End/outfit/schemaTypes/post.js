export default {
    name: 'post',
    title: 'Post',
    type: 'document',
    field: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',

        },
        {
            name: 'info',
            title: 'Info',
            type: 'string',
        },
        {
            name: 'color',
            title: 'Color',
            type: 'string',
        },
        {
            name: 'weather',
            title: 'Weather',
            type: 'string',
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options:{
                hotspot: true
            }
        },
        {
            name: 'userId',
            title: 'UserID',
            type: 'string',
        },
        {
            name: 'postedBy',
            title: 'PostedBy',
            type: 'postedBy',
        },
        {
            name: 'save',
            title: 'Save',
            type: 'array',
            of: [{type: 'save'}]
        },
        {
            name: 'comments',
            title: 'Comments',
            type: 'array',
            of:[{type: 'comment'}]
        },


    ]
}