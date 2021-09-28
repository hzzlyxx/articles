import React, { useCallback, useEffect, useState } from 'react';
import AV from 'leancloud-storage';
import { Radio, Input, Button, message, RadioChangeEvent } from 'antd';
import { appId, appKey, categories } from '@/Properties';

import './index.scss';

const { TextArea } = Input;

AV.init({ appId, appKey });

const Popup = () => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getContent();
  }, []);

  const getContent = useCallback(() => {
    const { chrome } = window;
    if (chrome && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query(
        {
          active: true,
          currentWindow: true,
        },
        (tabs) => {
          const tab = tabs[0];
          setUrl(tab.url);
          setTitle(tab.title);
        }
      );
    }
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTitle(value);
  }, []);

  const handleCateChange = useCallback((e: RadioChangeEvent) => {
    const { value } = e.target;
    setCategory(value);
  }, []);

  const handleDescChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setDescription(value);
  }, []);

  const handleSubmit = useCallback(() => {
    const post = {
      url,
      title,
      category,
      description,
    };
    setLoading(true);

    const ArticleObject = AV.Object.extend('Articles');
    const article = new ArticleObject();

    article
      .save(post)
      .then(
        () => {
          message.success('提交成功');
        },
        () => {
          message.error('提交失败');
        }
      )
      .finally(() => {
        setLoading(false);
      });
  }, [url, title, category, description]);

  const handleQuery = useCallback(() => {
    const { chrome } = window;
    if (chrome && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({
        url: './weekly.html',
      });
    }
  }, []);

  return (
    <div className="art-popup">
      <div className="art-popup__section">
        <p className="art-popup__title">链接</p>
        <p className="art-popup__content">{url}</p>
      </div>
      <div className="art-popup__section">
        <p className="art-popup__title">标题</p>
        <p className="art-popup__content">
          <Input onChange={handleTitleChange} value={title} placeholder="请输入标题" />
        </p>
      </div>
      <div className="art-popup__section">
        <p className="art-popup__title">分类</p>
        <div className="art-popup__content">
          <Radio.Group onChange={handleCateChange} value={category}>
            {categories.map((item) => (
              <Radio key={item.key} value={item.key}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
      <div className="art-popup__section">
        <p className="art-popup__title">说明</p>
        <div className="art-popup__content">
          <TextArea rows={3} onChange={handleDescChange} value={description} />
        </div>
      </div>
      <div className="art-popup__btns">
        <Button type="primary" onClick={handleQuery}>
          查看列表
        </Button>
        <Button type="primary" disabled={loading} onClick={handleSubmit}>
          提交
        </Button>
      </div>
    </div>
  );
};

export default Popup;
