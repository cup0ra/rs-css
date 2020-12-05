const levels = [
    {
        helpTitle: 'Select elements by their type',
        selectorName: 'Type Selector',
        doThis: 'Select the tombstone',
        selector: 'tombstone',
        syntax: 'A',
        help:
            'Selects all elements of type <strong>A</strong>. Type refers to the type of tag, so <tag>div</tag>, <tag>p</tag> and <tag>ul</tag> are all different element types.',
        examples: [
            '<strong>div</strong> selects all <tag>div</tag> elements.',
            '<strong>p</strong> selects all <tag>p</tag> elements.',
        ],
        boardMarkup: `
         <tombstone></tombstone>
         <tombstone></tombstone>
      `,
    },
    {
        doThis: 'Select the pumpkin',
        selector: 'pumpkin',
        syntax: 'A',
        helpTitle: 'Select elements by their type',
        selectorName: 'Type Selector',
        help:
            'Selects all elements of type <strong>A</strong>. Type refers to the type of tag, so <tag>div</tag>, <tag>p</tag> and <tag>ul</tag> are all different element types.',
        examples: [
            '<strong>div</strong> selects all <tag>div</tag> elements.',
            '<strong>p</strong> selects all <tag>p</tag> elements.',
        ],
        boardMarkup: `
      <earth></earth>
      <pumpkin></pumpkin>
      <earth></earth>
      `,
    },
    {
        doThis: 'Select the tombstone rip',
        selector: '#rip',
        selectorName: 'ID Selector',
        helpTitle: 'Select elements with an ID',
        syntax: '#id',
        help:
            'Selects the element with a specific <strong>id</strong>. You can also combine the ID selector with the type selector.',
        examples: [
            '<strong>#cool</strong> selects any element with <strong>id="cool"</strong>',
            '<strong>ul#long</strong> selects <tag>ul id="long"</tag>',
        ],
        boardMarkup: `
        <tombstone></tombstone>
        <tombstone id="rip"></tombstone>
        <tombstone></tombstone>
      `,
    },
    {
        helpTitle: 'Select an element inside another element',
        selectorName: 'Descendant Selector',
        doThis: 'Select the skull on the tombstone',
        selector: 'earth skull',
        syntax: 'A&nbsp;&nbsp;B',
        help:
            'Selects all <strong>B</strong> inside of <strong>A</strong>. <strong>B</strong> is called a descendant because it is inside of another element.',
        examples: [
            '<strong>p&nbsp;&nbsp;strong</strong> selects all <tag>strong</tag> elements that are inside of any <tag>p</tag>',
            '<strong>#fancy&nbsp;&nbsp;span</strong> selects any <tag>span</tag> elements that are inside of the element with <strong>id="fancy"</strong>',
        ],
        boardMarkup: `
      <tombstone></tombstone>
      <pumpkin></pumpkin>
      <earth><skull></skull></earth>
      <skull></skull>
      `,
    },
    {
        doThis: 'Select the bat on the rip tombstone',
        selector: '#rip bat',
        helpTitle: 'Combine the Descendant & ID Selectors',
        syntax: '#id&nbsp;&nbsp;A',
        help: 'You can combine any selector with the descendent selector.',
        examples: [
            '<strong>#cool&nbsp;span</strong> selects all <tag>span</tag> elements that are inside of elements with <strong>id="cool"</strong>',
        ],
        boardMarkup: `
        <tombstone><bat></bat></tombstone>
        <tombstone id="rip"><bat></bat></tombstone>
        <pumpkin><bat></bat></pumpkin>
      `,
    },
    {
        doThis: 'Select the small skull',
        selector: '.small',
        selectorName: 'Class Selector',
        helpTitle: 'Select elements by their class',
        syntax: '.classname',
        help:
            'The class selector selects all elements with that class attribute. Elements can only have one ID, but many classes.',
        examples: ['<strong>.neato</strong> selects all elements with <strong>class="neato"</strong>'],
        boardMarkup: `
      <skull class="small"></skull>
      <tombstone><skull class="small"></skull></tombstone>
      <skull></skull>
      `,
    },
    {
        doThis: 'Select the small casper',
        selector: 'casper.small',
        helpTitle: 'Combine the Class Selector',
        syntax: 'A.className',
        help: 'You can combine the class selector with other selectors, like the type selector.',
        examples: [
            '<strong>ul.important</strong> selects all <tag>ul</tag> elements that have <strong>class="important"</strong>',
            '<strong>#big.wide</strong> selects all elements with <strong>id="big"</strong> that also have <strong>class="wide"</strong>',
        ],
        boardMarkup: `
        <tombstone id="rip"><casper class="small"></casper></tombstone>
        <pumpkin><bat></bat></pumpkin>
        <casper></casper>`,
    },
    {
        doThis: 'Select the red bat in the tombstone',
        selector: 'tombstone bat.red',
        syntax: 'Put your back into it!',
        helpTitle: 'You can do it...',
        help: 'Combine what you learned in the last few levels to solve this one!',
        boardMarkup: `
        <tombstone id="rip"><bat class="red"></bat></tombstone>
        <pumpkin><bat></bat></pumpkin>
        <tombstone id="rip"><bat class="red"></bat></tombstone>
        <bat class="red"></bat>`,
    },
    {
        doThis: 'Select all the casper and skull',
        selector: 'casper,skull',
        selectorName: 'Comma Combinator',
        helpTitle: 'Combine, selectors, with... commas!',
        syntax: 'A, B',
        help:
            'Thanks to Shatner technology, this selects all <strong>A</strong> and <strong>B</strong> elements. You can combine any selectors this way, and you can specify more than two.',
        examples: [
            '<strong>p, .fun</strong> selects all <tag>p</tag> elements as well as all elements with <strong>class="fun"</strong>',
            '<strong>a, p, div</strong> selects all <tag>a</tag>, <tag>p</tag> and <tag>div</tag> elements',
        ],
        boardMarkup: `
        <casper></casper>
        <tombstone id="rip"><bat class="red"></bat></tombstone>
        <earth><skull></skull></earth>
      `,
    },
    {
        doThis: 'Select all the things!',
        selector: '*',
        selectorName: 'The Universal Selector',
        helpTitle: 'You can select everything!',
        syntax: '*',
        help: 'You can select all elements with the universal selector! ',
        examples: ['<strong>p *</strong> selects any element inside all <tag>p</tag> elements.'],
        boardMarkup: `
    <skull></skull>
    <casper></casper>
    <pumpkin></pumpkin>
    <bat class="red"></bat>
      `,
    },
    {
        doThis: 'Select everything on a tombstone',
        selector: 'tombstone *',
        syntax: 'A&nbsp;&nbsp;*',
        helpTitle: 'Combine the Universal Selector',
        help: 'This selects all elements inside of <strong>A</strong>.',
        examples: [
            '<strong>p *</strong> selects every element inside all <tag>p</tag> elements.',
            '<strong>ul.fancy *</strong> selects every element inside all <tag>ul class="fancy"</tag> elements.',
        ],
        boardMarkup: `
        <tombstone id="rip"><bat class="red"></bat></tombstone>
        <tombstone><bat></bat></tombstone>
        <tombstone id="rip"><bat class="red"></bat></tombstone>
     `,
    },
    {
        selectorName: 'Child Selector',
        syntax: 'A > B&nbsp;',
        doThis: 'Select the bat directly on a tombstone',
        selector: 'tombstone > bat',
        helpTitle: 'Select direct children of an element',
        help:
            'You can select elements that are direct children of other elements. A child element is any element that is nested directly in another element. <br><br>Elements that are nested deeper than that are called descendant elements.',
        examples: [
            '<strong>A > B</strong> selects all <strong>B</strong> that are a direct children <strong>A</strong>',
        ],
        boardMarkup: `
      <tombstone><pumpkin><bat></bat></pumpkin></tombstone>
      <pumpkin></pumpkin>
      <bat class="red"></bat>
      <tombstone id="rip"><bat></bat></tombstone>
    `,
    },
    {
        doThis: "Select every bat that's next to a earth",
        selector: 'earth + bat',
        helpTitle: 'Select an element that directly follows another element',
        selectorName: 'Adjacent Sibling Selector',
        syntax: 'A + B',
        help:
            "This selects all <strong>B</strong> elements that directly follow <strong>A</strong>. Elements that follow one another are called siblings. They're on the same level, or depth. <br/><br/>In the HTML markup for this level, elements that have the same indentation are siblings.",
        examples: [
            '<strong>p + .intro</strong> selects every element with <strong>class="intro"</strong> that directly follows a <tag>p</tag>',
            '<strong>div + a</strong> selects every <tag>a</tag> element that directly follows a <tag>div</tag>',
        ],
        boardMarkup: `
        <earth><skull class="small"></skull></earth>
        <bat></bat>
        <bat></bat>
        <earth></earth>
        <bat class="red"></bat>
      `,
    },
    {
        selectorName: 'General Sibling Selector',
        helpTitle: 'Select elements that follows another element',
        syntax: 'A ~ B',
        doThis: 'Select the casper beside the earth',
        selector: 'earth ~ casper',
        help:
            'You can select all siblings of an element that follow it. This is like the Adjacent Selector (A + B) except it gets all of the following elements instead of one.',
        examples: ['<strong>A ~ B</strong> selects all <strong>B</strong> that follow a <strong>A</strong>'],
        boardMarkup: `
      <earth><pumpkin></pumpkin></earth>
      <casper></casper>
      <casper class="small"></casper>
      <casper></casper>
      <earth><casper class="small"></casper></earth>
      `,
    },
    {
        selectorName: 'First Child Pseudo-selector',
        helpTitle: 'Select a first child element inside of another element',
        doThis: 'Select the top bat',
        selector: 'earth :first-child',
        syntax: ':first-child',

        help:
            'You can select the first child element. A child element is any element that is directly nested in another element. You can combine this pseudo-selector with other selectors.',
        examples: [
            '<strong>:first-child</strong> selects all first child elements.',
            '<strong>p:first-child</strong> selects all first child <tag>p</tag> elements.',
            '<strong>div p:first-child</strong> selects all first child <tag>p</tag> elements that are in a <tag>div</tag>.',
        ],
        boardMarkup: `
        <bat></bat>
        <earth>
          <skull class="small"></skull>
          <skull class="small"></skull>
          <skull class="small"></skull>
          <skull class="small"></skull>
        </earth>
        <bat></bat>
    `,
    },
    {
        selectorName: 'Last Child Pseudo-selector',
        helpTitle: 'Select the last element inside of another element',
        doThis: 'Select the small apple and the pickle',
        selector: 'earth :last-child',
        syntax: ':last-child',
        help:
            'You can use this selector to select an element that is the last child element inside of another element. <br><br>Pro Tip &rarr; In cases where there is only one element, that element counts as the first-child, only-child and last-child!',
        examples: [
            '<strong>:last-child</strong> selects all last-child elements.',
            '<strong>span:last-child</strong> selects all last-child <tag>span</tag> elements.',
            '<strong>ul li:last-child</strong> selects the last <tag>li</tag> elements inside of any <tag>ul</tag>.',
        ],
        boardMarkup: `
      <earth>
        <skull class="small"></skull>
        <skull class="small"></skull>
        <skull class="small"></skull>
        <skull class="small"></skull>
      </earth>`,
    },
    {
        selectorName: 'Nth Child Pseudo-selector',
        helpTitle: 'Select an element by its order in another element',
        doThis: 'Select the 3rd plate',
        selector: 'earth :nth-child(2)',
        syntax: ':nth-child(A)',
        help: 'Selects the <strong>nth</strong> (Ex: 1st, 3rd, 12th etc.) child element in another element.',
        examples: [
            '<strong>:nth-child(8)</strong> selects every element that is the 8th child of another element.',
            '<strong>div p:nth-child(2)</strong> selects the second <strong>p</strong> in every <strong>div</strong>',
        ],
        boardMarkup: `
        <skull class="small"></skull>
      <earth>
      <skull class="small"></skull>
      <skull class="small"></skull>
      <skull class="small"></skull>
      <skull class="small"></skull>
    </earth>
    <skull class="small"></skull>
    `,
    },
    {
        selectorName: 'Only Child Pseudo-selector',
        helpTitle: 'Select an element that are the only element inside of another one.',
        doThis: 'Select the bat on the tombstone',
        selector: 'tombstone :only-child',
        syntax: ':only-child',
        help: 'You can select any element that is the only element inside of another one.',
        examples: [
            '<strong>span:only-child</strong> selects the <tag>span</tag> elements that are the only child of some other element.',
            '<strong>ul li:only-child</strong> selects the only <tag>li</tag> element that are in a <tag>ul</tag>.',
        ],
        boardMarkup: `
        <tombstone id="rip"><bat class="red"></bat></tombstone>
        <tombstone><casper class="small"></casper></tombstone>
        <tombstone id="rip">
          <bat class="red"></bat>
          <bat></bat>
          <bat></bat>
        </tombstone>
    `,
    },
    {
        selectorName: 'Empty Selector',
        helpTitle: "Select elements that don't have children",
        doThis: 'Select the empty pumpkin',
        selector: 'pumpkin:empty',
        syntax: ':empty',
        help: "Selects elements that don't have any other elements inside of them.",
        examples: ['<strong>div:empty</strong> selects all empty <tag>div</tag> elements.'],
        boardMarkup: `
        <pumpkin></pumpkin>
        <skull></skull>
        <pumpkin></pumpkin>
        <pumpkin><bat></bat></pumpkin>
    `,
    },

    {
        doThis: 'Select the red bat in the tombstone',
        selector: 'earth > tombstone > bat',
        syntax: 'Put your back into it!',
        helpTitle: 'You can do it...',
        help: 'Combine what you learned in the last few levels to solve this one!',
        boardMarkup: `
    <earth><tombstone id="rip"><bat class="red"></bat></tombstone></earth>
    <tombstone id="rip"><bat class="red"></bat></tombstone>
    `,
    },
    {
        doThis: 'Select the red and bat',
        selector: '#rip > bat,pumpkin > bat',
        syntax: 'Put your back into it!',
        helpTitle: 'You can do it...',
        help: 'Combine what you learned in the last few levels to solve this one!',
        boardMarkup: `
    <earth>
      <tombstone id="rip"><bat class="red"></bat></tombstone>
      <pumpkin><bat></bat></pumpkin>
      <tombstone><bat class="red"></bat></tombstone>
    </earth>
    
  `,
    },
    {
        doThis: 'Select the bat in the pumpkin',
        selector: 'earth :nth-child(2) bat',
        syntax: 'Put your back into it!',
        helpTitle: 'You can do it...',
        help: 'Combine what you learned in the last few levels to solve this one!',
        boardMarkup: `
  <earth>
    <tombstone id="rip"></tombstone>
    <pumpkin><bat></bat></pumpkin>
    <tombstone id="rip"></tombstone>
    <pumpkin><bat></bat></pumpkin>
  </earth>
  
`,
    },
    {
        doThis: 'Select the bat in the pumpkin',
        selector: 'earth :nth-child(2n) bat',
        syntax: 'Put your back into it!',
        helpTitle: 'You can do it...',
        help: 'Combine what you learned in the last few levels to solve this one!',
        boardMarkup: `
  <earth>
    <pumpkin><bat></bat></pumpkin>
    <pumpkin><bat></bat></pumpkin>
    <pumpkin><bat></bat></pumpkin>
    <pumpkin><bat></bat></pumpkin>
  </earth>
  
`,
    },
    {
        doThis: 'Select the bat in the pumpkin',
        selector: 'earth :nth-child(-n + 3) bat',
        syntax: 'Put your back into it!',
        helpTitle: 'You can do it...',
        help: 'Combine what you learned in the last few levels to solve this one!',
        boardMarkup: `
  <earth>
    <pumpkin><bat></bat></pumpkin>
    <pumpkin><bat></bat></pumpkin>
    <pumpkin><bat></bat></pumpkin>
    <pumpkin><bat></bat></pumpkin>
  </earth>
  
`,
    },
];

export default levels;
