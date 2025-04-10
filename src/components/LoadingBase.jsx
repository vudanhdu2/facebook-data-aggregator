import { Modal, Spin } from "antd"
import React from "react"

const LoadingBase = ({ loading }) => {

    return (
        <Modal
            open={loading}
            centered
            width={200}
            footer={[]}
            closable={false}
        >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Spin />
                <p style={{ paddingLeft: 10 }}>okie</p>
            </div>

        </Modal>
    )
}

export default React.memo(LoadingBase);