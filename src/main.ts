import * as content from './content';
import * as tunnel from './tunnel';

const app = document.querySelector<HTMLDivElement>('#app')!;
const contentDiv = document.querySelector<HTMLDivElement>('#content')!;

content.render(contentDiv);
tunnel.render(app);
