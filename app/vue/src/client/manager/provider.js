/* global location */

import qs from 'qs';
import React from 'react';
import { Provider } from '@storybook/ui';
import addons from '@storybook/addons';
import createChannel from '@storybook/channel-postmessage';
import Preview from './preview';

export default class ReactProvider extends Provider {
  constructor() {
    super();
    this.channel = createChannel({ page: 'manager' });
    addons.setChannel(this.channel);
  }

  getPanels() {
    return addons.getPanels();
  }

  renderPreview(selectedKind, selectedStory) {
    const queryParams = {
      selectedKind,
      selectedStory,
    };

    const queryString = qs.stringify(queryParams);
    const url = `iframe.html?${queryString}`;
    return <Preview url={url} />;
  }

  handleAPI(api) {
    api.onStory((kind, story) => {
      this.channel.emit('setCurrentStory', { kind, story });
    });
    this.channel.on('setStories', data => {
      api.setStories(data.stories);
    });
    this.channel.on('rerender', data => {
      console.log('rerender request received in manager');
      this.channel.emit('rerender');
    });
    this.channel.on('selectStory', data => {
      api.selectStory(data.kind, data.story);
    });
    this.channel.on('applyShortcut', data => {
      api.handleShortcut(data.event);
    });
    addons.loadAddons(api);
  }
}
