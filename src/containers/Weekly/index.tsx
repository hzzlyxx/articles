import React, { useEffect, useState } from 'react';
import AV from 'leancloud-storage';
import dayjs from 'dayjs';
import { message, Spin, Select, Button } from 'antd';
import { appId, appKey, categories } from '@/Properties';
import logo from '@/assets/icon_128.png';

import './index.scss';

AV.init({ appId, appKey });

const { Option } = Select;

const START = '2021-09-27';
const VER = 1;

const Weekly = () => {
  const [list, setList] = useState([]);
  const [options, setOptions] = useState([]);
  const [version, setVersion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const vers = genVers();

    const newOptions = vers.map((t) => ({
      value: `${t.start}~${t.end}`,
      label: `第${t.version}期（${t.start} ~ ${t.end}）`,
    }));
    const newVersion = newOptions[vers.length - 1].value;

    setOptions(newOptions);
    setVersion(newVersion);

    fetchList(newVersion);
  }, []);

  const handleChange = (value: string) => {
    setVersion(value);
    fetchList(value);
  };

  const genVers = () => {
    const days = dayjs().diff(dayjs(START), 'days');
    let sum = Math.ceil(days / 7);

    if (dayjs().day() === 1 && dayjs().hour() > 12) {
      sum += 1;
    }

    const opts = new Array(sum).fill('').map((t, idx) => ({
      version: VER + idx,
      start: dayjs(START)
        .add(6 * idx, 'days')
        .format('YYYY-MM-DD'),
      end: dayjs(START)
        .add(6 * (idx + 1), 'days')
        .format('YYYY-MM-DD'),
    }));

    return opts;
  };

  const fetchList = (ver: string) => {
    setLoading(true);

    let [start, end] = ver.split('~');

    start = dayjs(start).hour(12) as unknown as string;
    end = dayjs(end).hour(12) as unknown as string;

    fetchQuery(start, end)
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

  const fetchQuery = (start: string, end: string) => {
    const startQuery = new AV.Query('Articles');
    startQuery.greaterThan('createdAt', new Date(start));

    const endQuery = new AV.Query('Articles');
    endQuery.lessThan('createdAt', new Date(end));

    const query = AV.Query.and(startQuery, endQuery);

    return query.find();
  };

  const handleExport = () => {
    let md = '';

    categories.forEach((c) => {
      let str = `## **${c.label}**\n\n`;

      list
        .filter((t) => t.category === c.key)
        .forEach((p) => {
          str += `* [${p.title}](${p.url})\n\n> ${p.description}\n\n`;
        });

      md += str;
    });

    const blob = new Blob([md]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = `${version}.md`;
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Spin spinning={loading}>
      <div className="art-list">
        <h1 className="art-list__logo">
          <img src={logo} alt="" />
          <span>Articles</span>
        </h1>
        <div className="art-list__toolbar">
          <Select value={version} placeholder="请选择" onChange={handleChange}>
            {options.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={handleExport}>
            Export Weekly
          </Button>
        </div>
        {categories.map((cate) => {
          return (
            <div key={cate.key} className="art-list__category">
              <h2 id={cate.key}>{cate.label}</h2>
              <ul className="art-list__ul">
                {list
                  .filter((t) => t.category === cate.key)
                  .map((post) => {
                    return (
                      <li key={post.objectId} className="art-list__li">
                        <div className="art-list__li-line">
                          <a href={post.url} target="_blank" rel="noreferrer">
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
          );
        })}
      </div>
    </Spin>
  );
};

export default Weekly;
