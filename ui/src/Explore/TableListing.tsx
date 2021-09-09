/*
 * Copyright (C) 2020 Dremio
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React, { useEffect, useState } from "react";
import { Card, ListGroup, ListGroupItem } from "react-bootstrap";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import FolderIcon from "@material-ui/icons/Folder";
import ExploreLink from "./ExploreLink";
import { api, Entry } from "../utils";
import { factory } from "../ConfigLog4j";

const log = factory.getLogger("api.TableListing");

const groupItem = (key: Key, ref: string, path: string[]) => {
  const icon =
    key.type === "CONTAINER" ? <FolderIcon /> : <InsertDriveFileOutlinedIcon />;
  return (
    <ListGroupItem key={key.name}>
      <ExploreLink
        toRef={ref}
        path={path.concat(key.name)}
        type={key.type === "CONTAINER" ? "CONTAINER" : "OBJECT"}
      >
        {icon}
        {key.name}
      </ExploreLink>
    </ListGroupItem>
  );
};

const fetchKeys = (
  ref: string,
  path: string[],
  setKeys: (v: Key[]) => void
) => {
  return api()
    .getEntries({ ref })
    .then((data) => {
      const keys = filterKeys(path, data.entries ?? []);
      setKeys(keys);
    })
    .catch((e) => log.error("Entries", e));
};

interface Key {
  name: string;
  type: "CONTAINER" | "TABLE";
}

// TODO: move this to server-side. Filter to keys relevant for this view.
const filterKeys = (path: string[], keys: Entry[]): Key[] => {
  const containers = new Set();
  const filteredKeys = keys
    .map((key) => key.name?.elements)
    .filter((name) => {
      if (!name || name.length <= path.length) {
        return false;
      }

      // make sure all key values match the current path.
      return name
        .slice(0, path.length)
        .every((v, i) => v.toLowerCase() === path[i].toLowerCase());
    })
    .map((s) => s)
    .map((name) => {
      const ele = name[path.length];
      if (name.length > path.length + 1) {
        containers.add(ele);
      }
      return ele;
    });

  const distinctKeys = new Set(filteredKeys);
  const distinctObjs = Array.from(distinctKeys).map((key) => {
    return {
      name: key,
      type: containers.has(key) ? "CONTAINER" : "TABLE",
    } as any as Key;
  });
  return distinctObjs;
};

const TableListing = (props: {
  currentRef: string;
  path: string[];
}): React.ReactElement => {
  const [keys, setKeys] = useState<Key[]>([]);
  useEffect(() => {
    void fetchKeys(props.currentRef, props.path, setKeys);
  }, [props.currentRef, props.path]);

  return (
    <Card>
      <ListGroup variant={"flush"}>
        {keys.map((key) => {
          return groupItem(key, props.currentRef, props.path);
        })}
      </ListGroup>
    </Card>
  );
};

TableListing.defaultProps = {
  currentRef: "main",
  path: [],
};

export default TableListing;
