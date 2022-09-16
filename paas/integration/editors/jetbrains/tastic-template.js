## Frontastic Tastic PHPStorm Template
#set( $TasticName = ${StringUtils.removeAndHump( ${NAME} )} )
import React from 'react'
import PropTypes from 'prop-types'

class ${TasticName} extends React.Component {
    render () {
        const { data } = this.props

        return <div>${TasticName} says Hello World!</div>
    }
}

${TasticName}.propTypes = {
    data: PropTypes.shape({}),
}

${TasticName}.defaultProps = {}

export default ${TasticName}
