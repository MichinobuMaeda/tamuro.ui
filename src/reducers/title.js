/*  
 * Copyright (c) 2017, Michinobu Maeda 
 * Licensed under the MIT License.
 * See LICENSE file in the project root for full license information.  
 */

import { A } from '../actions/constants'

const title = (state = null, action) => {
  switch (action.type) {
    case A.SET_TITLE:
      return action.title
    default:
      return state
  }
}

export default title
