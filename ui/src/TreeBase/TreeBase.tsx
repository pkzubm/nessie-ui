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

import { Card } from "react-bootstrap";
import React from "react";
import { Outlet } from "react-router-dom";
import { TreeTableHead, PathTreeTableHead } from "../TableHead";
import { Branch, Tag } from "../generated/utils/api";

type NavDropdownProps = {
  branches: Branch[];
  tags: Tag[];
  defaultBranch: string;
  path: string[];
  currentRef?: string;
  content: boolean;
};

const TreeBase = ({
  defaultBranch,
  tags,
  branches,
  path,
  currentRef,
  content,
}: NavDropdownProps): React.ReactElement => {
  return path.length > 0 ? (
    <React.Fragment>
      <PathTreeTableHead
        branches={branches}
        tags={tags}
        defaultBranch={defaultBranch}
        currentRef={currentRef as string}
        path={path}
        type={content ? "OBJECT" : "CONTAINER"}
      />
      <Card>
        <Outlet />
      </Card>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <TreeTableHead
        branches={branches}
        tags={tags}
        defaultBranch={defaultBranch}
        currentRef={currentRef as string}
        path={path}
      />
      <Card>
        <Outlet />
      </Card>
    </React.Fragment>
  );
};

export default TreeBase;
