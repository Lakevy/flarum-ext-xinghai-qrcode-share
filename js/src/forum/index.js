import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import PostControls from 'flarum/forum/utils/PostControls';
import Button from 'flarum/common/components/Button';
import QrCodeModal from './components/QrCodeModal';

app.initializers.add('liubei/qrcode-share', () => {
  // FoF Blog articles are Flarum discussions, so the first-post action covers
  // both ordinary discussion originals and blog article originals without
  // depending on FoF Blog internals. Replies deliberately have no QR action.
  extend(PostControls, 'userControls', (items, post) => {
    if (post.number() !== 1 || !post.discussion()) return;

    items.add(
      'qrcode-share',
      <Button
        icon="fas fa-qrcode"
        onclick={() => app.modal.show(QrCodeModal, { discussion: post.discussion() })}
      >
        {app.translator.trans('liubei-qrcode-share.forum.post_controls.qrcode')}
      </Button>,
      0
    );
  });

});
