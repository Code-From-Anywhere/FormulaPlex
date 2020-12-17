const Windows = () => {

    return (
        windows.map(window=>{

            return (
                <Rnd
  size={{ width: this.state.width,  height: this.state.height }}
  position={{ x: this.state.x, y: this.state.y }}
  onDragStop={(e, d) => { this.setState({ x: d.x, y: d.y }) }}
  onResizeStop={(e, direction, ref, delta, position) => {
    this.setState({
      width: ref.style.width,
      height: ref.style.height,
      ...position,
    });
  }}
>
  001
</Rnd>s
            )
        })
    )

}