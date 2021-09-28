import React, { useEffect, useState } from 'react';
import AV from 'leancloud-storage';
import { message, Spin, Select } from 'antd';
import { appId, appKey, categories } from '@/Properties';
import logo from '@/assets/icon_128.png';

import './index.scss';

AV.init({ appId, appKey });

const { Option } = Select;

const List = () => {
  const [list, setList] = useState([]);
  const [category, setCategory] = useState('interview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchList(category);
  }, []);

  const handleChange = (value: string) => {
    setCategory(value);
    setList([]);
    fetchList(value);
  };

  const fetchList = (cate: string) => {
    setLoading(true);

    fetchQuery(cate)
      .then(
        (res) => {
          message.success('数据加载成功');

          const newList = res.map((t) => t.toJSON());
          setList(newList);
        },
        (e) => {
          message.error(e.toString());
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchQuery = (cate: string) => {
    const query = new AV.Query('Articles');

    query.equalTo('category', cate);

    return query.find();
  };

  return (
    <Spin spinning={loading}>
      <div className="art-list">
        <h1 className="art-list__logo">
          <img src={logo} alt="" />
          <span>Articles</span>
        </h1>
        <div className="art-list__toolbar">
          <Select value={category} placeholder="请选择" onChange={handleChange}>
            {categories.map((item) => (
              <Option key={item.key} value={item.key}>
                {item.label}
              </Option>
            ))}
          </Select>
        </div>
        <div className="art-list__category">
          <h2>{categories.filter((item) => item.key === category)[0].label}</h2>
          <ul className="art-list__ul">
            {list.map((post) => {
              return (
                <li key={post.objectId} className="art-list__li">
                  <div className="art-list__li-line">
                    <a href={post.url} target="_blank" rel="noreferrer" title={post.title}>
                      {post.title}
                    </a>
                    <span>{post.createdAt.slice(0, 10)}</span>
                  </div>
                  <blockquote>{post.description}</blockquote>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Spin>
  );
};

export default List;
